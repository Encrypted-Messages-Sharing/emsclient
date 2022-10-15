import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  useTor: boolean;
  pass: string;
  hub: string;
  sidebarMode: 'channels' | 'keys';
  selectedChannel: string | null;
  savedChannels: {
    channel: string;
    hub: string;
  }[];
  savedHubs: string[];
  savedKeys: {
    name: string;
    value: string;
  }[];
  messages: {
    "message_id": number,
    text: string,
    channel: string,
    comment: string,
    "dt_create": string,
    "good_till": string
  }[];
  selectedMessage: number;
  autoKey: {
    name: string;
    value: string;
  } | null;
}

export let initialState: AppState = {
  useTor: false,
  pass: '',
  hub: '',
  sidebarMode: 'channels',
  selectedChannel: null,
  savedChannels: [],
  savedHubs: [],
  savedKeys: [],
  messages: [],
  selectedMessage: -1,
  autoKey: null
}


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    update(state, action: PayloadAction<Partial<AppState>>) {
      const entries = Object.keys(action.payload);
      entries.forEach((key) => {
        // @ts-ignore
        state[key] = action.payload[key];
      })
    },

    addMessages(state, action: PayloadAction<AppState['messages']>) {
      state.messages.push(...action.payload)
    },

    clear: () => initialState
  }
})

export default appSlice