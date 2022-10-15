import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface NotifyState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export let initialState: NotifyState = {
  message: '',
  type: 'error',
}


const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    update(state, action: PayloadAction<Partial<NotifyState>>) {
      const entries = Object.keys(action.payload);
      entries.forEach((key) => {
        // @ts-ignore
        state[key] = action.payload[key];
      })
    },

    clear: () => initialState
  }
})

export default notifySlice