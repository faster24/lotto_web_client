import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="screen-root auth-register-screen" data-testid="auth-register-page">
      <header className="auth-register-hero">
        <p className="auth-register-hero__eyebrow">Lottery Hub</p>
        <h1>Create your account and start placing lucky picks</h1>
        <p className="auth-register-hero__subtitle">
          Set up your profile to track draws, save number plays, and manage your balance in one place.
        </p>
      </header>

      <main className="auth-register-scroll">
        <form className="auth-register-card" onSubmit={handleSubmit}>
          <p className="auth-register-card__label">New Account</p>

          <div className="auth-register-field">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              required
              minLength={2}
            />
          </div>

          <div className="auth-register-field">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="auth-register-field">
            <label htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="09 123 456 789"
              required
            />
          </div>

          <div className="auth-register-field">
            <label htmlFor="register-password">Password</label>
            <div className="auth-register-password-wrap">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-register-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-controls="register-password"
                aria-pressed={showPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="auth-register-field">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <div className="auth-register-password-wrap">
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-register-password-toggle"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-controls="register-confirm-password"
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-register-submit-btn">
            Create Account
            <span aria-hidden="true">{'->'}</span>
          </button>

          <p className="auth-register-divider">Quick option</p>

          <button type="button" className="auth-register-ghost-btn">
            <span className="auth-register-ghost-icon" aria-hidden="true">
              G
            </span>
            Continue with Google
          </button>

          <p className="auth-register-login-row">
            Already have an account?{' '}
            <Link to="/auth/login" className="auth-register-login-link">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
