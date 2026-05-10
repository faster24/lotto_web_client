import { createEmptyRow, type BetNumberRow } from './useBetsForm'

// All unique permutations of a 3-digit string (handles repeated digits)
export function getPermutations3D(num: string): string[] {
    const digits = num.split('')
    const perms = new Set<string>()
    const permute = (remaining: string[], current: string) => {
        if (remaining.length === 0) {
            perms.add(current)
            return
        }
        for (let i = 0; i < remaining.length; i++) {
            permute([...remaining.slice(0, i), ...remaining.slice(i + 1)], current + remaining[i])
        }
    }
    permute(digits, '')
    return [...perms]
}

// R not surrounded by Myanmar (U+1000–U+109F), Thai (U+0E00–U+0E7F), or Latin letters
const NON_LETTER = '[^a-zA-Zက-႟฀-๿]'
const BOX_R_RE = new RegExp(
    `\\(r\\)|@|(${NON_LETTER}|^)[rR](${NON_LETTER}|$)`,
)

function hasBoxMarker(s: string): boolean {
    return BOX_R_RE.test(s)
}

/**
 * Parse pasted 3D bet text.
 *
 * Each line must start with a 3-digit number followed by separators and amounts.
 * Supported patterns:
 *   123.20.10      → Direct 20, Box 10
 *   123=50/30      → Direct 50, Box 30
 *   123.10r10      → Direct 10, Box 10  (r between amounts = box marker + split)
 *   123=10R        → Direct 10, Box 10  (single amount + R = same for both)
 *   123-100-20     → Direct 100, Box 20
 *   123=200x100    → Direct 200, Box 100
 *   123            → Direct = defaultAmount, no Box
 *
 * Box rows are expanded to ALL unique permutations of the 3-digit number.
 * E.g. Box 123 → adds rows for 123, 132, 213, 231, 312, 321.
 */
export function parsePastedBets3D(text: string, defaultAmount: string): BetNumberRow[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
    const results: BetNumberRow[] = []
    const seen = new Set<string>()

    const add = (number: string, amount: string) => {
        const key = `${number}|${amount}`
        if (!seen.has(key)) {
            seen.add(key)
            results.push({ ...createEmptyRow(), number, amount })
        }
    }

    for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line) continue

        // 3-digit number must appear at the start of the line
        const numberMatch = line.match(/^(\d{3})\b/)
        if (!numberMatch) continue

        const number = numberMatch[1]!
        const afterNumber = line.slice(numberMatch[0].length)

        const isBox = hasBoxMarker(afterNumber)

        // Strip R/r markers before extracting amounts to avoid them being misread
        const stripped = afterNumber.replace(/[rR]/g, ' ')
        const amountMatches = stripped.match(/\d{2,}/g) ?? []

        let directAmount: string
        let boxAmount: string | null

        if (amountMatches.length === 0) {
            directAmount = defaultAmount
            boxAmount = isBox ? defaultAmount : null
        } else if (amountMatches.length === 1) {
            directAmount = amountMatches[0]!
            boxAmount = isBox ? amountMatches[0]! : null
        } else {
            directAmount = amountMatches[0]!
            boxAmount = amountMatches[1]!
        }

        add(number, directAmount)

        if (boxAmount !== null) {
            for (const perm of getPermutations3D(number)) {
                add(perm, boxAmount)
            }
        }
    }

    return results
}
