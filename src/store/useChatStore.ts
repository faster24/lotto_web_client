import { create } from 'zustand'

export type ChatRole = 'user' | 'vip' | 'admin'

export type ChatMessage = {
  id: string
  userName: string
  message: string
  role: ChatRole
}

type ChatStore = {
  chats: ChatMessage[]
  addMessage: (message: ChatMessage) => void
}

const initialChats: ChatMessage[] = [
  {
    id: '1',
    userName: 'Aung Lay',
    message: 'Any strong number pair for this session?',
    role: 'user',
  },
  {
    id: '2',
    userName: 'Royal Club',
    message: 'Tracking 8 and 5 in all rounds today.',
    role: 'vip',
  },
  {
    id: '3',
    userName: 'System Admin',
    message: 'Please keep chat respectful during live updates.',
    role: 'admin',
  },
]

export const useChatStore = create<ChatStore>((set) => ({
  chats: initialChats,
  addMessage: (message) =>
    set((state) => ({
      chats: [...state.chats, message],
    })),
}))
