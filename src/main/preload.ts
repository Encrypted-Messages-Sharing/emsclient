const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('store', {
  setUserAuth: (pass: string) => ipcRenderer.invoke('store:setUserAuth', pass),
  tryAuth: (pass: string) => ipcRenderer.invoke('store:tryAuth', pass),
  removeUserData: () => ipcRenderer.invoke('store:removeUserData'),
  setSavedContent: (contentType: string, content: string, pass: string) => 
    ipcRenderer.invoke('store:setSavedContent', contentType, content, pass),
  isAuthExists: () => ipcRenderer.invoke('store:isAuthExists'),
})

contextBridge.exposeInMainWorld('requests', {
  testHub: (hub: string, useTor: boolean ) => ipcRenderer.invoke('requests:testHub', hub, useTor),
  getChannelMessages: (
    hub: string, 
    channel: string, 
    limit: number, 
    offset: number, 
    useTor: boolean
  ) => ipcRenderer.invoke('requests:getChannelMessages', hub, channel, limit, offset, useTor),
  sendMessage: (
    hub: string, 
    channel: string, 
    text: string,
    comment: string, 
    liveTime: number, 
    useTor: boolean
  ) => ipcRenderer.invoke('requests:sendMessage', hub, channel, text, comment, liveTime, useTor),
  testTor: () => ipcRenderer.invoke('requests:testTor'),
})