import { describe, it, expect } from 'vitest'
import { parsePastedBets3D, getPermutations3D } from '../components/bets/parsePastedBets3D'

describe('getPermutations3D', () => {
    it('returns 6 unique permutations for distinct digits', () => {
        const perms = getPermutations3D('123')
        expect(perms).toHaveLength(6)
        expect(new Set(perms).size).toBe(6)
        expect(perms).toContain('123')
        expect(perms).toContain('132')
        expect(perms).toContain('213')
        expect(perms).toContain('231')
        expect(perms).toContain('312')
        expect(perms).toContain('321')
    })

    it('returns 3 permutations for one repeated digit (112)', () => {
        const perms = getPermutations3D('112')
        expect(perms).toHaveLength(3)
        expect(perms).toContain('112')
        expect(perms).toContain('121')
        expect(perms).toContain('211')
    })

    it('returns 1 permutation for all-same digits (111)', () => {
        const perms = getPermutations3D('111')
        expect(perms).toHaveLength(1)
        expect(perms).toContain('111')
    })
})

describe('parsePastedBets3D', () => {
    const hasRow = (rows: ReturnType<typeof parsePastedBets3D>, number: string, amount: string) =>
        rows.some((r) => r.number === number && r.amount === amount)

    it('dot-separated: 123.20.10 → Direct 20, Box perms at 10', () => {
        const rows = parsePastedBets3D('123.20.10', '100')
        expect(hasRow(rows, '123', '20')).toBe(true)   // direct
        expect(rows.filter((r) => r.amount === '10')).toHaveLength(6)
        expect(hasRow(rows, '132', '10')).toBe(true)
    })

    it('equals-slash: 123=50/30 → Direct 50, Box perms at 30', () => {
        const rows = parsePastedBets3D('123=50/30', '100')
        expect(hasRow(rows, '123', '50')).toBe(true)   // direct
        expect(rows.filter((r) => r.amount === '30')).toHaveLength(6)
    })

    it('r-split: 123.10r10 → Direct 10, Box 10 (deduped since same amount)', () => {
        const rows = parsePastedBets3D('123.10r10', '100')
        // Direct 123 at 10 and box perms at 10; 123 deduped to one entry
        expect(hasRow(rows, '123', '10')).toBe(true)
        expect(rows.filter((r) => r.amount === '10')).toHaveLength(6)
    })

    it('single amount + R: 123=10R → Direct 10, Box 10 (deduped)', () => {
        const rows = parsePastedBets3D('123=10R', '100')
        expect(hasRow(rows, '123', '10')).toBe(true)
        expect(rows.filter((r) => r.amount === '10')).toHaveLength(6)
    })

    it('dash-separated: 123-100-20 → Direct 100, Box 20', () => {
        const rows = parsePastedBets3D('123-100-20', '100')
        expect(hasRow(rows, '123', '100')).toBe(true)  // direct
        expect(rows.filter((r) => r.amount === '20')).toHaveLength(6)
    })

    it('x-separated: 123=200x100 → Direct 200, Box 100', () => {
        const rows = parsePastedBets3D('123=200x100', '100')
        expect(hasRow(rows, '123', '200')).toBe(true)  // direct
        expect(rows.filter((r) => r.amount === '100')).toHaveLength(6)
    })

    it('no amount → uses defaultAmount for Direct, no Box', () => {
        const rows = parsePastedBets3D('123', '500')
        expect(rows).toHaveLength(1)
        expect(rows[0]!.number).toBe('123')
        expect(rows[0]!.amount).toBe('500')
    })

    it('only direct amount → Direct set, no Box', () => {
        const rows = parsePastedBets3D('123=300', '100')
        expect(rows).toHaveLength(1)
        expect(rows[0]!.number).toBe('123')
        expect(rows[0]!.amount).toBe('300')
    })

    it('repeated digit box 112.50.20 → 3 box perms', () => {
        const rows = parsePastedBets3D('112.50.20', '100')
        expect(rows.filter((r) => r.amount === '20')).toHaveLength(3)
    })

    it('skips line without leading 3-digit number', () => {
        const rows = parsePastedBets3D('ab=100/50', '100')
        expect(rows).toHaveLength(0)
    })

    it('multiple lines parsed independently', () => {
        const text = '123=500\n456=300/100'
        const rows = parsePastedBets3D(text, '100')
        expect(hasRow(rows, '123', '500')).toBe(true)
        expect(hasRow(rows, '456', '300')).toBe(true)
        expect(rows.filter((r) => r.amount === '100').length).toBeGreaterThan(0)
    })

    it('deduplicates identical number+amount pairs', () => {
        const text = '123=100/100'
        const rows = parsePastedBets3D(text, '100')
        // Direct 123 at 100 and Box perm 123 at 100 → same key, deduped to one entry
        const count123 = rows.filter((r) => r.number === '123').length
        expect(count123).toBe(1)
    })
})
