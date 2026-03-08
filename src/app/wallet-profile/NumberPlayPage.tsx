import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const selectedNumbers = [
  { id: 'pick-1', value: '54', type: '2D', stake: '3,000 MMK' },
  { id: 'pick-2', value: '45', type: '2D R', stake: '3,000 MMK' },
  { id: 'pick-3', value: '128', type: '3D Straight', stake: '2,000 MMK' },
]

export function NumberPlayPage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-number-play-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Ticket Builder</p>
        <h1>Number Play</h1>
        <p className="wallet-profile-header__caption">Compose 2D and 3D picks before confirming your stake list.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="number-play" />

        <section className="wallet-profile-card" aria-labelledby="number-play-entry-heading">
          <div className="wallet-profile-card__head">
            <h2 id="number-play-entry-heading">Quick entry</h2>
            <p>Draft numbers only</p>
          </div>

          <form className="wallet-profile-form" onSubmit={(event) => event.preventDefault()}>
            <fieldset className="wallet-profile-mode-switch">
              <legend>Play mode</legend>
              <label>
                <input type="radio" name="play-mode" defaultChecked />
                2D
              </label>
              <label>
                <input type="radio" name="play-mode" />
                3D
              </label>
            </fieldset>

            <label className="wallet-profile-form__field" htmlFor="number-play-input">
              Number
              <input id="number-play-input" type="text" inputMode="numeric" maxLength={3} placeholder="00 or 000" />
            </label>

            <fieldset className="wallet-profile-chip-row">
              <legend>Preset actions</legend>
              <button type="button">Add R</button>
              <button type="button">Add Doubles</button>
              <button type="button">3D Wheel</button>
            </fieldset>

            <button type="submit" className="wallet-profile-primary-btn">
              Add to slip
            </button>
          </form>
        </section>

        <section className="wallet-profile-card" aria-labelledby="number-play-picked-heading">
          <div className="wallet-profile-card__head">
            <h2 id="number-play-picked-heading">Selected plays</h2>
            <p>{selectedNumbers.length} active picks</p>
          </div>

          <ul className="wallet-profile-list" aria-label="Current selected numbers">
            {selectedNumbers.map((pick) => (
              <li key={pick.id} className="wallet-profile-list-item">
                <div>
                  <p className="wallet-profile-list-item__title">{pick.value}</p>
                  <p className="wallet-profile-list-item__meta">{pick.type}</p>
                </div>
                <p className="wallet-profile-list-item__amount">{pick.stake}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
