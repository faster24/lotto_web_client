import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

type Toast = { id: string; message: string; type: ToastType }

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer != null) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => {
      const next = [...prev, { id, message, type }]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
    const timer = setTimeout(() => dismiss(id), 3000)
    timersRef.current.set(id, timer)
  }, [dismiss])

  const borderColor: Record<ToastType, string> = {
    success: 'border-[#00e676]/50',
    error: 'border-red-500/50',
    info: 'border-blue-500/50',
  }

  const textColor: Record<ToastType, string> = {
    success: 'text-[#00e676]',
    error: 'text-red-400',
    info: 'text-blue-400',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center w-full max-w-[22rem] px-4"
        style={{ bottom: 'calc(80px + env(safe-area-inset-bottom) + 0.75rem)' }}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full rounded-xl border bg-[#1a2035] px-4 py-3 shadow-xl flex items-center justify-between gap-3 ${borderColor[toast.type]}`}
            role="alert"
          >
            <p className={`m-0 text-[0.85rem] font-semibold ${textColor[toast.type]}`}>{toast.message}</p>
            <button
              type="button"
              className="text-white/40 hover:text-white transition-colors shrink-0"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-[1rem]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (ctx == null) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
