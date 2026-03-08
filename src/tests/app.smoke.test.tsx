import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App smoke test', () => {
  it('renders the shell heading and placeholder content', () => {
    render(<App />)

    expect(screen.getByTestId('app-shell')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Lottery Web Client',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('TODO: Feature modules mount here')).toBeInTheDocument()
  })
})
