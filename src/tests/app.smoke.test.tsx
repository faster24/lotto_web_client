import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App smoke test', () => {
  it('renders the routed shell and tabs home page', async () => {
    render(<App />)

    expect(screen.getByTestId('mobile-frame-shell')).toBeInTheDocument()

    expect(screen.getByTestId('tabs-home-page')).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Home/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { level: 2, name: 'Current Number' })).toBeInTheDocument()
  })
})
