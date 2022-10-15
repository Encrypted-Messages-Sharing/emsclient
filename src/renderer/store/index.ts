import { configureStore } from '@reduxjs/toolkit'
import { bindActionCreators } from 'redux'

import app, { AppState } from './app'
import notify, { NotifyState } from './notify'
 
const store = configureStore({
  reducer: {
    app: app.reducer,
    notify: notify.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export interface StoreState {
  app: AppState;
  notify: NotifyState;
}

export const AppStore = bindActionCreators(app.actions, store.dispatch);
export const NotifyStore = bindActionCreators(notify.actions, store.dispatch);

export default store;
