import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Actions from "renderer/actions";
import { StoreState } from "renderer/store";
import Dropdown from "../dropdown";
import Modal from "../modal";
import ShowSvg from '../../images/svg/show.svg';
import UnShowSvg from '../../images/svg/unshow.svg';
import "./index.css";
import ModalTitle from "../modal/modalTitle";

interface SendMessageModalProps {
  isOpened: boolean;
  close: () => void;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  isOpened,
  close,
}) => {
  const { hub, useTor, keys, channels } = useSelector((state: StoreState) => ({
    hub: state.app.hub,
    useTor: state.app.useTor,
    keys: state.app.savedKeys,
    channels: state.app.savedChannels.filter((ch) => ch.hub === state.app.hub),
  }));
  const [channel, setChannel] = useState('');
  const [text, setText] = useState('');
  const [comment, setComment] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [openedChannelsDropdown, setOpenedChannelsDropdown] = useState(false);
  const [openedKeysDropdown, setOpenedKeysDropdown] = useState(false);
  const [keyHidden, setKeyHidden] = useState(true);

  const channelSelectRef = useRef<HTMLButtonElement>(null);
  const keySelectRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (!isOpened) {
      setChannel('');
      setText('');
      setComment('');
      setKey('');
    }
  }, [isOpened])

  const submit = async () => {
    if (!channel || !text || !key) return;

    if (key.length > 32 ) return;

    if (
      channel.length > 100 &&
      !/[a-zA-Z\d]+/.test(channel)
    ) return;

    setLoading(true)
    const res = await Actions.sendMessage({
      hub,
      text,
      channel,
      comment,
      key,
      useTor,
    })
    setLoading(false);

    if (res === 'success') {
      Actions.sendNotify({
        message: 'Message has been sent!',
        type: 'success'
      })
      close();
    }
    else {
      Actions.sendNotify({
        message: 'Error occured while sending a message.',
        type: 'error'
      })
    }
  }

  return (
    <Modal isOpened={isOpened} onClose={close} width={800} height={541} padding='20px 20px 0 20px'>
      <div style={{
        height: '100%',
      }}>
        <ModalTitle title="Send a message" close={close} />

        <div className="send-message-inputs">
          <input 
            placeholder="Comment (optional) (max length 100) !! WILL NOT BE ENCRYPTED !!" 
            value={comment}
            onChange={(e) => setComment(e.target.value)} />
          <textarea 
            placeholder="Text" 
            value={text}
            rows={14}
            onChange={(e) => setText(e.target.value)} />
          <div style={{
            display: 'flex',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', position: 'relative', width: '50%', marginRight: '10px' }}>
              <input 
                placeholder="Channel" 
                value={channel}
                onChange={(e) => setChannel(e.target.value)} 
                style={{ flex: 1 }} />
              <button 
                className={channels.filter((ch) => ch.channel !== channel).length ? '' : 'disabled'}
                ref={channelSelectRef}
                onClick={() => channels.filter((ch) => ch.channel !== channel).length && setOpenedChannelsDropdown(!openedChannelsDropdown)}>
                  SELECT
              </button>
              <Dropdown 
                opened={openedChannelsDropdown}
                values={channels.filter((ch) => ch.channel !== channel).map((ch) => ({
                  text: ch.channel,
                  value: ch.channel
                }))}
                buttonRef={channelSelectRef}
                onClickItem={(e: any) => {setChannel(e); setOpenedChannelsDropdown(false)}}
                onClose={() => setOpenedChannelsDropdown(false)}
                display='up'
              />
            </div>
            <div style={{ display: 'flex', position: 'relative', width: '50%' }}>
              <input 
                placeholder="Key (max length 32)" 
                style={{ flex: 1 }} 
                value={key}
                type={keyHidden ? 'password' : 'text'}
                onChange={(e) => setKey(e.target.value)}
              />
              <div style={{
                position: 'absolute',
                right: '110px',
                top: '10px',
                cursor: 'pointer'
              }} onClick={() => setKeyHidden(!keyHidden)}>
                <img src={keyHidden ? UnShowSvg : ShowSvg} />
              </div>
              <button 
                className={keys.filter((k) => k.value !== key).length ? '' : 'disabled'}
                ref={keySelectRef}
                onClick={() => keys.filter((k) => k.value !== key).length && setOpenedKeysDropdown(!openedKeysDropdown)}>
                SELECT
              </button>
              <Dropdown 
                opened={openedKeysDropdown}
                values={keys.filter((k) => k.value !== key).map((k) => ({
                  text: k.name,
                  value: k.value
                }))}
                buttonRef={keySelectRef}
                onClickItem={(e: any) => {setKey(e); setOpenedKeysDropdown(false)}}
                onClose={() => setOpenedKeysDropdown(false)}
                display='up'
              />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#202124', paddingBottom: '20px', position: 'sticky', bottom: 0 }}>
          <button 
            style={{ width: '100%' }} 
            onClick={!loading ? submit : undefined}>
              {loading ? 'Loading...' : 'SEND'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SendMessageModal;