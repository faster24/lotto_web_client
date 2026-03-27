import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { registerUser } from '@/api/client'
import type { RegisterInput } from '@/api/types'
import {
    AuthCard,
    AuthFeedback,
    AuthField,
    AuthScreen,
    authInputClassName,
    authPasswordWrapClassName,
    authPrimaryButtonClassName,
    authToggleClassName,
} from '@/components/auth/AuthFormPrimitives'

const initialForm: RegisterInput = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
}

export function RegisterPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [form, setForm] = useState<RegisterInput>(initialForm)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const fromState = (location.state as { from?: string } | null)?.from
    const postAuthPath = typeof fromState === 'string' && fromState.startsWith('/') && !fromState.startsWith('//') ? fromState : '/tabs/home'

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setSuccess(null)

        if (form.password !== form.password_confirmation) {
            setError('Password and confirmation must match.')
            return
        }

        setLoading(true)

        try {
            const response = await registerUser(form)
            setSuccess(`${response.message}. Redirecting...`)
            window.setTimeout(() => {
                void navigate(postAuthPath, { replace: true })
            }, 500)
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : 'Registration failed. Check your form and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthScreen
            testId="auth-register-page"
            title="Create your account and start placing lucky picks"
            subtitle="Set up your profile to track draws, save number plays, and manage your balance in one place."
        >
            <AuthCard label="New Account" apiNote="">
                <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
                    <AuthField htmlFor="register-username" label="Username">
                        <input
                            id="register-username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            className={authInputClassName}
                            placeholder="Your username"
                            required
                            maxLength={255}
                            value={form.username}
                            onChange={(event) => {
                                const value = event.currentTarget.value
                                setForm((prev) => ({ ...prev, username: value }))
                            }}
                        />
                    </AuthField>

                    <AuthField htmlFor="register-email" label="Email Address">
                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className={authInputClassName}
                            placeholder="name@example.com"
                            required
                            value={form.email}
                            onChange={(event) => {
                                const value = event.currentTarget.value
                                setForm((prev) => ({ ...prev, email: value }))
                            }}
                        />
                    </AuthField>

                    <AuthField htmlFor="register-password" label="Password">
                        <div className={authPasswordWrapClassName}>
                            <input
                                id="register-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                className={authInputClassName}
                                placeholder="At least 8 characters"
                                required
                                minLength={8}
                                value={form.password}
                                onChange={(event) => {
                                    const value = event.currentTarget.value
                                    setForm((prev) => ({ ...prev, password: value }))
                                }}
                            />
                            <button
                                type="button"
                                className={authToggleClassName}
                                onClick={() => setShowPassword((value) => !value)}
                                aria-controls="register-password"
                                aria-pressed={showPassword}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3 21 21" strokeLinecap="round" />
                                        <path d="M10.7 6.4A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.9 16.9 0 0 1-3.1 3.9" strokeLinecap="round" />
                                        <path d="M6.4 10.7A16.8 16.8 0 0 0 2.5 12s3.5 6 9.5 6c1.8 0 3.3-.5 4.6-1.2" strokeLinecap="round" />
                                        <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                                <span className="sr-only">{showPassword ? 'Hide' : 'Show'}</span>
                            </button>
                        </div>
                    </AuthField>

                    <AuthField htmlFor="register-confirm-password" label="Confirm Password">
                        <div className={authPasswordWrapClassName}>
                            <input
                                id="register-confirm-password"
                                name="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                className={authInputClassName}
                                placeholder="Re-enter your password"
                                required
                                minLength={8}
                                value={form.password_confirmation}
                                onChange={(event) => {
                                    const value = event.currentTarget.value
                                    setForm((prev) => ({ ...prev, password_confirmation: value }))
                                }}
                            />
                            <button
                                type="button"
                                className={authToggleClassName}
                                onClick={() => setShowConfirmPassword((value) => !value)}
                                aria-controls="register-confirm-password"
                                aria-pressed={showConfirmPassword}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3 21 21" strokeLinecap="round" />
                                        <path d="M10.7 6.4A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.9 16.9 0 0 1-3.1 3.9" strokeLinecap="round" />
                                        <path d="M6.4 10.7A16.8 16.8 0 0 0 2.5 12s3.5 6 9.5 6c1.8 0 3.3-.5 4.6-1.2" strokeLinecap="round" />
                                        <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                                <span className="sr-only">{showConfirmPassword ? 'Hide' : 'Show'}</span>
                            </button>
                        </div>
                    </AuthField>

                    {error != null && <AuthFeedback kind="error" message={error} />}
                    {success != null && <AuthFeedback kind="success" message={success} />}

                    <button type="submit" className={authPrimaryButtonClassName} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                        <span aria-hidden="true" className="rounded-full bg-[rgb(4_10_31_/_16%)] px-1.5 text-[0.8rem]">
                            {'->'}
                        </span>
                    </button>

                    <p className="m-0 pt-1 text-center text-[0.8rem] text-[#8a9bb3]">
                        Already have an account?{' '}
                        <Link
                            to="/auth/login"
                            state={fromState != null ? { from: fromState } : null}
                            className="font-bold text-[#00e676] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[rgb(0_230_118_/_25%)]"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </AuthScreen>
    )
}
