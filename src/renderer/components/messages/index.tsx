import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppStore, StoreState } from 'renderer/store';
import Modal from '../modal';
import ChannelPick from '../channelPick';
import LeaveSvg from '../../images/svg/leave.svg';
import RefreshSvg from '../../images/svg/refresh.svg';
import Actions from 'renderer/actions';
import MessagesList from './messagesList';
import MessageView from './messageView';
import './index.css';
import AutoKeySetter from './autoKeySetter';
import ModalTitle from '../modal/modalTitle';

const Messages = () => {
  const [leaveChannelConfirm, setLeaveChannelConfirm] = useState(false);
  const { 
    selectedChannel,
    hub,
    savedChannelsList,
    pass,
    channel,
  } = useSelector((state: StoreState) => ({
    selectedChannel: state.app.selectedChannel,
    hub: state.app.hub,
    savedChannelsList: state.app.savedChannels,
    pass: state.app.pass,
    channel: state.app.selectedChannel,
  }));
  const isSaved = useMemo(() => 
    !!savedChannelsList.find((ch) => ch.channel === selectedChannel && ch.hub === hub),
  [savedChannelsList, selectedChannel]);

  const [reqData, setReqData] = useState({
    limit: 30,
    offset: 0
  });

  useEffect(() => {
    setReqData({
      limit: 30,
      offset: 0
    })
  }, [channel])

  const leaveChannel = () => {
    AppStore.update({
      selectedChannel: null,
      messages: [],
      selectedMessage: -1
    });
    setLeaveChannelConfirm(false);
  }

  const saveChannel = () => {
    Actions.addSavedChannel({
      channel: selectedChannel || '',
      hub,
      savedChannelsList,
      pass,
    });
  }

  const refreshChannel = () => {
    AppStore.update({
      selectedMessage: -1
    });
    setReqData({
      limit: 30,
      offset: 0
    })
  }

  return (
    <div className={`messages ${!selectedChannel ? 'to-pick' : ''}`}>
      <Modal 
        isOpened={leaveChannelConfirm}
        onClose={() => setLeaveChannelConfirm(false)}
      >
        <ModalTitle title="Are you sure you want to leave the channel?" close={close} />
        <div className='modal-actions'>
          <button className='bg-red' onClick={leaveChannel}>Yes</button>
          <button onClick={() => setLeaveChannelConfirm(false)}>No</button>
        </div>
      </Modal>
      {!selectedChannel && <ChannelPick />}
      {!!selectedChannel && (
        <div>
          <div className="messages-header">
            <div className="selected-channel">{selectedChannel}</div>
            {pass !== 'nopass' && (
              <>
                {isSaved ? '' : (
                  <div className="event-channel add-channel" onClick={saveChannel}>SAVE</div>
                )}
                <AutoKeySetter />
              </>
            )}
            <div className="event-channel refresh-channel" onClick={refreshChannel}>
              <img src={RefreshSvg} />
            </div>
            <div className="event-channel close-channel" onClick={() => setLeaveChannelConfirm(true)}>
              <img src={LeaveSvg} />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <MessagesList reqData={reqData} setReqData={setReqData} />
            <MessageView />
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
