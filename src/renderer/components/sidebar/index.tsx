import { useSelector } from 'react-redux';
import Actions from 'renderer/actions';
import { AppStore, StoreState } from 'renderer/store';
import SidebarList from '../sidebarList';
import ChannelSvg from '../../images/svg/channel.svg';
import KeySvg from '../../images/svg/key.svg';
import LeaveSvg from '../../images/svg/leave.svg';
import './index.css';
import Modal from '../modal';
import { useState } from 'react';
import SendMessageModal from '../sendMessageModal';
import ModalTitle from '../modal/modalTitle';

interface SidebarProps {
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { sidebarMode, hub, pass } = useSelector((state: StoreState) => ({
    sidebarMode: state.app.sidebarMode,
    hub: state.app.hub,
    pass: state.app.pass
  }));
  const [leaveHubConfim, setLeaveHubConfim] = useState(false);
  const [openedSendMessage, setOpenedSendMessage] = useState(false);

  return (
    <div className="sidebar">
      <SendMessageModal 
        isOpened={openedSendMessage}
        close={() => setOpenedSendMessage(false)}
      />
      <Modal 
        isOpened={leaveHubConfim}
        onClose={() => setLeaveHubConfim(false)}
      >
        <ModalTitle title="Are you sure you want to leave the hub?" close={close} />
        <div className='modal-actions'>
          <button className='bg-red' onClick={() => Actions.leaveHub()}>Yes</button>
          <button onClick={() => setLeaveHubConfim(false)}>No</button>
        </div>
      </Modal>
      <div className="current-hub">
        <div className='green-dot' />
        <div className='current-hub-name'>
          {hub}
        </div>
        <div className="leave-hub" onClick={() => setLeaveHubConfim(true)}>
          <img src={LeaveSvg} />
        </div>
      </div>
      <div className='send-message' onClick={() => setOpenedSendMessage(true)}>
        SEND MESSAGE        
      </div>
      {pass !== 'nopass' && (
        <>
          <SidebarList />
          <div className="sidebar-menu">
            <div 
              className={sidebarMode === 'channels' ? 'active' : undefined}
              onClick={() => AppStore.update({sidebarMode: 'channels'})}>
              <img src={ChannelSvg} />
              CHANNELS
            </div>
            <div 
              className={sidebarMode === 'keys' ? 'active' : undefined}
              onClick={() => AppStore.update({sidebarMode: 'keys'})}>
              <img src={KeySvg} /> 
              KEYS
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
