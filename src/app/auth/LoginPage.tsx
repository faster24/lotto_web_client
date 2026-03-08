import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="screen-root auth-login-screen" data-testid="auth-login-page">
      <header className="auth-login-hero">
        <p className="auth-login-hero__eyebrow">Lottery Hub</p>
        <h1>Sign in and keep your lucky streak moving</h1>
        <p className="auth-login-hero__subtitle">
          Continue with your account to check results, place number plays, and manage your wallet.
        </p>
      </header>

      <main className="auth-login-scroll">
        <form className="auth-login-card" onSubmit={handleSubmit}>
          <p className="auth-login-card__label">Welcome Back</p>

          <div className="auth-login-field auth-login-field--email">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="auth-login-field auth-login-field--password">
            <label htmlFor="login-password">Password</label>

            <div className="auth-login-password-wrap">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                minLength={6}
              />

              <button
                type="button"
                className="auth-login-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-controls="login-password"
                aria-pressed={showPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-login-submit-btn">
            Sign In
            <span aria-hidden="true">{'->'}</span>
          </button>

          <p className="auth-login-divider">Or continue with</p>

          <button type="button" className="auth-login-google-btn">
            <span className="auth-login-google-icon" aria-hidden="true">
              G
            </span>
            Continue with Google
          </button>

          <p className="auth-login-register-row">
            Don't have an account?{' '}
            <Link to="/auth/register" className="auth-login-register-link">
              Create one
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
