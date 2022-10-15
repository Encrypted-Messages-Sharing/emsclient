import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppStore, StoreState } from 'renderer/store';
import ChannelCreate from './channelCreate';
import KeyCreate from './keyCreate';
import TrashSvg from '../../images/svg/trash.svg';
import Actions from 'renderer/actions';
import DeleteItem from './deleteItem';
import './index.css';

const SidebarList = () => {
  const { sidebarMode, channels, keys, hub, pass, unTouchedChannels } = useSelector((state: StoreState) => ({
    sidebarMode: state.app.sidebarMode,
    unTouchedChannels: state.app.savedChannels,
    channels: state.app.savedChannels.filter((ch) => ch.hub === state.app.hub).map((ch) => ({ name: ch.channel })),
    keys: state.app.savedKeys,
    hub: state.app.hub,
    pass: state.app.pass
  }));
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [deleteItemConfirmation, setDeleteItemConfirmation] = useState(-1);

  const deleteItemConfirm = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, i: number) => {
    e.stopPropagation();
    setDeleteItemConfirmation(i)
  }

  const deleteItem = () => {
    const item = sidebarMode === 'channels' ? channels[deleteItemConfirmation] : keys[deleteItemConfirmation];
    const data = {
      hub,
      channel: item.name,
      name: item.name,
      savedKeysList: keys,
      pass,
      savedChannelsList: unTouchedChannels
    }

    if (sidebarMode === 'channels') {
      Actions.deleteSavedChannel(data)

      return;
    }
    Actions.deleteSavedKey(data)
  }

  return (
    <div className="sidebar-list">
      {sidebarMode === 'channels' ? 
        <ChannelCreate opened={createModalOpened} close={() => setCreateModalOpened(false)} /> : 
        <KeyCreate opened={createModalOpened} close={() => setCreateModalOpened(false)} />
      }
      <DeleteItem 
        opened={deleteItemConfirmation > -1}
        close={() => setDeleteItemConfirmation(-1)}
        deleteItem={() => deleteItem()}
        type={sidebarMode === 'channels' ? 'channel' : 'key'} />
      {(sidebarMode === 'channels' ? channels : keys).map((item, i) => (
        <div 
          key={`sidebar-item-${i}`} 
          className="sidebar-list-item"
          onClick={sidebarMode === 'channels' ? () => AppStore.update({
            selectedChannel: item.name,
            selectedMessage: -1,
            autoKey: null,
          }) : undefined}>
          <div>
            {item.name}
          </div>
          <img src={TrashSvg} onClick={(e) => deleteItemConfirm(e, i)} />
        </div>
      ))}
      <div className="sidebar-list-add" onClick={() => setCreateModalOpened(true)}>ADD {sidebarMode === 'channels' ? 'CHANNEL' : 'KEY'}</div>
    </div>
  );
};

export default SidebarList;
