import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import Actions from "renderer/actions";
import { StoreState } from "renderer/store";
import { aesDecrypt } from "renderer/utils";
import ShowSvg from '../../images/svg/show.svg';
import UnShowSvg from '../../images/svg/unshow.svg';
import Dropdown from "../dropdown";
import Loader from "../loader";

const MessageView = () => {
  const { message, selectedMessage, keys, autoKey } = useSelector((state: StoreState) => ({
    message: state.app.messages.find((m) => m.message_id === state.app.selectedMessage),
    selectedMessage: state.app.selectedMessage,
    keys: state.app.savedKeys,
    autoKey: state.app.autoKey
  }));
  const [decrypted, setDecrypted] = useState('');
  const [key, setKey] = useState('');
  const [keyHidden, setKeyHidden] = useState(true);
  const [openedKeysDropdown, setOpenedKeysDropdown] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [viewRaw, setViewRaw] = useState(false);

  const keySelectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setKey('');
    setDecrypted('')
    setKeyHidden(true);
    setViewRaw(false);
    if (message && autoKey) {
      decrypt(autoKey.value)
    }
  }, [message])

  const decrypt = async (presetKey?: string) => {
    const keyToUse = presetKey || key;
    if (!keyToUse.trim() || !message) return;

    try {
      setDecrypting(true);
      setDecrypted(await aesDecrypt(message.text, keyToUse.trim()));
      setDecrypting(false);
    } 
    catch (e) {
      setDecrypting(false);
      Actions.sendNotify({
        message: 'Decryiption failed',
        type: 'error'
      });
    }
  }

  return (
    <div className="message-view-block">
      {decrypting && <Loader />}
      {selectedMessage === -1 ? (
        <p style={{ textAlign: 'center', color: '#777E98' }}>Select a message</p>
      ) : (
        <>
          <div>
            <div className="message-id">id: {message?.message_id}</div>
            <p style={{ margin: 0, color: 'gray', fontSize: '11px', lineHeight: '15px' }}>Comment</p>
            <p className="message-comment">{message?.comment || 'No comment'}</p>
            <div style={{ marginTop: '10px' }}>
              {decrypted ? (
                <>
                  <p style={{ margin: 0, color: 'gray', fontSize: '11px', lineHeight: '15px' }}>Content</p>
                  <div className="message-content">
                    {`${decrypted}`}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <div style={{ 
                    marginBottom: '10px', 
                    position: 'relative', 
                    display: 'flex',
                  }}>
                    <input 
                      placeholder="Key" 
                      style={{ width: '250px' }} 
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
                      display='down'
                    />
                  </div>
                  <button
                    style={{ width: '379.19px' }} 
                    onClick={() => decrypt()}>
                    DECRYPT
                  </button>
                </div>
              )}
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div 
              className="view-raw-message" 
              onClick={() => setViewRaw(true)}>
              {viewRaw ? message?.text : (
                <p>
                  VIEW RAW (ENCRYPTED) MESSAGE
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MessageView;