import { AppRouter } from '@/app/AppRouter'

function App() {
  return (
    <>
      <div
        data-testid="app-shell"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <h1>Lottery Web Client</h1>
        <p>TODO: Feature modules mount here</p>
      </div>
      <AppRouter />
    </>
  )
}

export default App
