import { AppStore, NotifyStore } from 'renderer/store';
import { AppState } from 'renderer/store/app';
import { NotifyState } from 'renderer/store/notify';
import { aesEncrypt } from 'renderer/utils';
import createActions from './createActions';

const Actions = createActions({
  authWithPass: async (data: {pass: string, isAuthExists: boolean}) => {
    const { pass, isAuthExists } = data;
    if (isAuthExists) {
      const authData = await window.store.tryAuth(pass);
      if (authData) {
        AppStore.update({
          pass,
          savedChannels: authData.channels || [],
          savedHubs: authData.hubs || [],
          savedKeys: authData.keys || [],
        })
      }
      else
        return 'error'
    }
    else {
      window.store.setUserAuth(pass);
      AppStore.update({
        pass,
        savedChannels: [],
        savedHubs: [],
        savedKeys: [],
      })
    }
  },

  pickHub: async (data: {
    hub: string, 
    withRemember: boolean,
    savedHubsList: string[],
    pass: string,
    useTor: boolean,
  }) => {
    const { hub, savedHubsList, withRemember, pass, useTor } = data;

    const hubStatus = await window.requests.testHub(hub, useTor)

    if (!hubStatus) 
      return 'error'

    if (!savedHubsList.includes(hub) && withRemember) {
      const hubs = [...savedHubsList, hub];
      window.store.setSavedContent('hubs', hubs, pass)
      AppStore.update({savedHubs: hubs});
    }

    AppStore.update({hub});
  },

  deleteSavedHub: async (data: {
    hub: string,
    savedHubsList: string[],
    pass: string
  }) => {
    const { hub, savedHubsList, pass } = data;
    const index = savedHubsList.findIndex((h) => hub == h);

    if (index > -1) {
      const hubs = [...savedHubsList];
      hubs.splice(index, 1);
      window.store.setSavedContent('hubs', hubs, pass);
      AppStore.update({savedHubs: hubs});
    }
  },

  addSavedChannel: (data: {
    channel: string,
    hub: string,
    savedChannelsList: AppState['savedChannels'],
    pass: string,
  }) => {
    const { channel, hub, savedChannelsList, pass } = data;

    const isExists = !!savedChannelsList.find((ch) => ch.channel === channel && ch.hub === hub);

    if (!isExists) {
      const channels = [...savedChannelsList, {channel, hub}];
      window.store.setSavedContent('channels', channels, pass);
      AppStore.update({savedChannels: channels});
    }
  },

  deleteSavedChannel: async (data: {
    channel: string,
    hub: string,
    savedChannelsList: AppState['savedChannels'],
    pass: string
  }) => {
    const { channel, hub, savedChannelsList, pass } = data;
    const index = savedChannelsList.findIndex((ch) => ch.channel === channel && ch.hub === hub);

    if (index > -1) {
      const channels = [...savedChannelsList];
      channels.splice(index, 1);
      window.store.setSavedContent('channels', channels, pass);
      AppStore.update({savedChannels: channels});
    }
  },

  addSavedKey: (data: {
    name: string,
    key: string,
    savedKeysList: AppState['savedKeys'],
    pass: string,
  }) => {
    const { 
      name,
      key,
      savedKeysList,
      pass,
    } = data;

    const keys = [...savedKeysList, { name, value: key }];
    window.store.setSavedContent('keys', keys, pass);
    AppStore.update({savedKeys: keys});
  },

  deleteSavedKey: (data: {
    name: string,
    savedKeysList: AppState['savedKeys'],
    pass: string,
  }) => {
    const { 
      name,
      savedKeysList,
      pass,
    } = data;

    const index = savedKeysList.findIndex((k) => k.name === name);

    if (index > -1) {
      const keys = [...savedKeysList];
      keys.splice(index, 1);
      window.store.setSavedContent('keys', keys, pass);
      AppStore.update({savedKeys: keys});
    }
  },

  loadMessages: async (data: {
    channel: string,
    hub: string,
    limit: number,
    offset: number,
    withReset: boolean,
    useTor: boolean
  }) => {
    const {
      channel,
      hub,
      limit,
      offset,
      withReset,
      useTor
    } = data;
    const req = await window.requests.getChannelMessages(hub, channel, limit, offset, useTor);

    if (req === 'error') return 'error';

    if (withReset) AppStore.update({messages: req.messages});
    else AppStore.addMessages(req.messages);
    return req.fullCount;
  },

  sendMessage: async (data: {
    hub: string,
    text: string, 
    channel: string, 
    comment?: string,
    key: string,
    useTor: boolean
  }) => {
    const { 
      hub,
      text,
      channel,
      comment,
      key,
      useTor
    } = data;

    const res = await window.requests.sendMessage(
      hub, 
      channel, 
      await aesEncrypt(text, key), 
      comment || "", 
      604800, 
      useTor
    );

    if (!res) return 'error';
    return 'success';
  },

  leaveHub: () => {
    AppStore.update({hub: ''});
  },

  sendNotify: ((): any => {
    let timeout: NodeJS.Timeout;
    return (data: NotifyState) => {
      if (timeout) clearTimeout(timeout);

      NotifyStore.update(data);
      timeout = setTimeout(() => {
        NotifyStore.update({
          message: '',
        })
      }, 2000);
    }
  })(),

  testTor: async () => {
    const res = await window.requests.testTor();
    return res;
  }
});

export default Actions;