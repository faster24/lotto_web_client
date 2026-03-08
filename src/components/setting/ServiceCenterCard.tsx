type ServiceItem = {
  id: string
  title: string
  subtitle: string
}

const serviceItems: ServiceItem[] = [
  {
    id: 'announcements',
    title: 'Announcements',
    subtitle: 'Platform updates and notices',
  },
  {
    id: 'help-center',
    title: 'Support Center',
    subtitle: 'Ask for account assistance',
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'Terms, versions, and policy',
  },
]

export function ServiceCenterCard() {
  return (
    <section className="service-center-card" aria-labelledby="service-center-heading">
      <h2 id="service-center-heading">Service Center</h2>

      <ul className="service-center-grid">
        {serviceItems.map((item) => (
          <li key={item.id}>
            <button type="button" className="service-center-item">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="service-center-logout">
        Log out
      </button>
    </section>
  )
}
