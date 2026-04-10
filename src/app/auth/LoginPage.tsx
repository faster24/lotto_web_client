import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loginUser } from '@/api/client'
import type { LoginInput } from '@/api/types'
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

const initialForm: LoginInput = {
    email: '',
    password: '',
}

export function LoginPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState<LoginInput>(initialForm)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const fromState = (location.state as { from?: string } | null)?.from
    const postAuthPath = typeof fromState === 'string' && fromState.startsWith('/') && !fromState.startsWith('//') ? fromState : '/tabs/home'

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        try {
            const response = await loginUser(form)
            setSuccess(`${response.message}. Redirecting...`)
            window.setTimeout(() => {
                void navigate(postAuthPath, { replace: true })
            }, 500)
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : t('auth.loginFailed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthScreen testId="auth-login-page" title={t('auth.signInTitle')}>
            <AuthCard label={t('auth.welcomeBack')} apiNote="">
                <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
                    <AuthField htmlFor="login-email" label={t('auth.emailAddress')}>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className={authInputClassName}
                            placeholder={t('auth.emailPlaceholder')}
                            required
                            value={form.email}
                            onChange={(event) => {
                                const value = event.currentTarget.value
                                setForm((prev) => ({ ...prev, email: value }))
                            }}
                        />
                    </AuthField>

                    <AuthField htmlFor="login-password" label={t('auth.password')}>
                        <div className={authPasswordWrapClassName}>
                            <input
                                id="login-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                className={authInputClassName}
                                placeholder={t('auth.passwordPlaceholder')}
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
                                aria-controls="login-password"
                                aria-pressed={showPassword}
                                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
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
                                <span className="sr-only">{showPassword ? t('auth.hidePassword') : t('auth.showPassword')}</span>
                            </button>
                        </div>
                    </AuthField>

                    {error != null && <AuthFeedback kind="error" message={error} />}
                    {success != null && <AuthFeedback kind="success" message={success} />}

                    <button type="submit" className={authPrimaryButtonClassName} disabled={loading}>
                        {loading ? t('auth.signingIn') : t('auth.signIn')}
                        <span aria-hidden="true" className="rounded-full bg-[rgb(4_10_31_/_16%)] px-1.5 text-[0.8rem]">
                            {'->'}
                        </span>
                    </button>

                    <p className="m-0 pt-1 text-center text-[0.8rem] text-[#8a9bb3]">
                        {t('auth.noAccount')}{' '}
                        <Link
                            to="/auth/register"
                            state={fromState != null ? { from: fromState } : null}
                            className="font-bold text-[#00e676] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[rgb(0_230_118_/_25%)]"
                        >
                            {t('auth.createOne')}
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </AuthScreen>
    )
}
