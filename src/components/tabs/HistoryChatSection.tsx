import { type FormEvent, useState } from 'react'
import { type ChatMessage, type ChatRole, useChatStore } from '@/store/useChatStore'

const historySnaps = [
  { label: '12:01 PM', value: '45' },
  { label: '02:30 PM', value: '89' },
  { label: '04:30 PM', value: '85' },
]

function roleBadgeClassName(role: ChatRole) {
  if (role === 'admin') {
    return 'chat-message__role chat-message__role--admin'
  }

  if (role === 'vip') {
    return 'chat-message__role chat-message__role--vip'
  }

  return 'chat-message__role'
}

function getAvatarText(userName: string) {
  return userName
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function HistoryChatSection() {
  const chats = useChatStore((state) => state.chats)
  const addMessage = useChatStore((state) => state.addMessage)
  const [draftMessage, setDraftMessage] = useState('')

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedMessage = draftMessage.trim()

    if (trimmedMessage.length === 0) {
      return
    }

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
      userName: 'You',
      message: trimmedMessage,
      role: 'user',
    }

    addMessage(newMessage)
    setDraftMessage('')
  }

  return (
    <section className="history-chat-card" aria-labelledby="history-chat-heading">
      <div className="history-chat-card__header">
        <h2 id="history-chat-heading">History / Chat</h2>

        <div className="history-chat-card__meta">
          <span className="history-chat-card__live-indicator">
            <span aria-hidden className="history-chat-card__dot" />
            Live
          </span>
          <span className="history-chat-card__audience">1.2K viewers</span>
        </div>
      </div>

      <ul className="history-strip" aria-label="Today number history">
        {historySnaps.map((item) => (
          <li key={item.label} className="history-strip__item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>

      <ul className="chat-list" aria-label="Live chat">
        {chats.map((chat) => (
          <li key={chat.id} className="chat-message">
            <span aria-hidden className="chat-message__avatar">
              {getAvatarText(chat.userName)}
            </span>

            <article className="chat-message__bubble">
              <p className="chat-message__name-row">
                <span>{chat.userName}</span>
                <span className={roleBadgeClassName(chat.role)}>{chat.role}</span>
              </p>
              <p className="chat-message__text">{chat.message}</p>
            </article>
          </li>
        ))}
      </ul>

      <form className="chat-composer" onSubmit={submitMessage}>
        <label className="chat-composer__label" htmlFor="home-chat-input">
          Add a chat message
        </label>

        <div className="chat-composer__controls">
          <input
            id="home-chat-input"
            name="home-chat-input"
            type="text"
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.currentTarget.value)}
            placeholder="Write a comment"
            autoComplete="off"
          />

          <button type="submit" aria-label="Send message">
            Send
          </button>
        </div>
      </form>
    </section>
  )
}
