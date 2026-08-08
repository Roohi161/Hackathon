import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: string;
  time: string;
  text: string;
  isMe: boolean;
}

const STORAGE_KEY = 'hc_org_network_chat';

const seedPublic: ChatMessage[] = [
  { id: 'msg-seed-1', sender: 'Elena Rostova (Vercel India Hub)', time: '10:30 AM', text: 'Hey organizers! Finalizing our Web3 Sprint prize dates for September.', isMe: false },
  { id: 'msg-seed-2', sender: 'Suresh Kumar (Apex Bank Labs)', time: '10:35 AM', text: 'Sounds great. We are hosting FinTech Disrupt in November to avoid collision.', isMe: false },
];

const loadJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
};

const persist = (state: { publicMessages: ChatMessage[]; directMessages: Record<string, ChatMessage[]> }) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ publicMessages: state.publicMessages, directMessages: state.directMessages })
    );
  } catch {
    // ignore
  }
};

const makeId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const makeMessage = (sender: string, text: string, isMe: boolean): ChatMessage => ({
  id: makeId(),
  sender,
  time: nowTime(),
  text,
  isMe,
});

interface OrganizerChatState {
  publicMessages: ChatMessage[];
  directMessages: Record<string, ChatMessage[]>;
  sendPublic: (text: string, meName: string) => ChatMessage;
  sendDirect: (contactId: string, text: string, meName: string) => ChatMessage;
  receivePublic: (sender: string, text: string) => ChatMessage;
  receiveDirect: (contactId: string, sender: string, text: string) => ChatMessage;
  reset: () => void;
}

const initial = loadJSON<{ publicMessages: ChatMessage[]; directMessages: Record<string, ChatMessage[]> }>(STORAGE_KEY, {
  publicMessages: seedPublic,
  directMessages: {},
});

export const useOrganizerChatStore = create<OrganizerChatState>((set, get) => ({
  publicMessages: initial.publicMessages,
  directMessages: initial.directMessages,

  sendPublic: (text, meName) => {
    const msg = makeMessage(`${meName} (You)`, text, true);
    const next = [...get().publicMessages, msg];
    persist({ publicMessages: next, directMessages: get().directMessages });
    set({ publicMessages: next });
    return msg;
  },

  sendDirect: (contactId, text, meName) => {
    const msg = makeMessage(`${meName} (You)`, text, true);
    const thread = get().directMessages[contactId] || [];
    const nextThread = [...thread, msg];
    const directMessages = { ...get().directMessages, [contactId]: nextThread };
    persist({ publicMessages: get().publicMessages, directMessages });
    set({ directMessages });
    return msg;
  },

  receivePublic: (sender, text) => {
    const msg = makeMessage(sender, text, false);
    const next = [...get().publicMessages, msg];
    persist({ publicMessages: next, directMessages: get().directMessages });
    set({ publicMessages: next });
    return msg;
  },

  receiveDirect: (contactId, sender, text) => {
    const msg = makeMessage(sender, text, false);
    const thread = get().directMessages[contactId] || [];
    const nextThread = [...thread, msg];
    const directMessages = { ...get().directMessages, [contactId]: nextThread };
    persist({ publicMessages: get().publicMessages, directMessages });
    set({ directMessages });
    return msg;
  },

  reset: () => {
    persist({ publicMessages: seedPublic, directMessages: {} });
    set({ publicMessages: seedPublic, directMessages: {} });
  },
}));
