type Props = {
    message: string
    onClose: () => void
}

export function BetMessageModal({ message, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(4_10_31_/_56%)] p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="bet-message-title"
                aria-describedby="bet-message-description"
                className="w-full max-w-sm rounded-2xl border border-[rgb(255_255_255_/_16%)] bg-[#0f1d38] p-5 shadow-[0_18px_42px_rgb(4_10_31_/_45%)]"
            >
                <div id="bet-message-title" className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(59_130_246_/_30%)] bg-[rgb(59_130_246_/_14%)] mx-auto">
                    <svg viewBox="0 0 24 24" aria-label="Notice" className="h-5 w-5 text-[#93c5fd]" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <p id="bet-message-description" className="mt-2 mb-0 text-center text-sm text-[#a7b4cb]">
                    {message}
                </p>
                <button
                    type="button"
                    className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl border-0 bg-[#00e676] text-sm font-semibold text-[#04141f] transition hover:brightness-110"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    )
}
