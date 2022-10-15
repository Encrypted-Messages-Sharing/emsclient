import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Actions from "renderer/actions";
import { StoreState } from "renderer/store";
import ShowSvg from '../../images/svg/show.svg';
import UnShowSvg from '../../images/svg/unshow.svg';
import CloseSvg from '../../images/svg/close.svg';
import Modal from "../modal";
import ModalTitle from "../modal/modalTitle";

interface KeyCreateProps {
  close(): void;
  opened: boolean;
}

const KeyCreate: React.FC<KeyCreateProps> = ({ close, opened }) => {
  const { keys, pass } = useSelector((state: StoreState) => ({
    keys: state.app.savedKeys,
    pass: state.app.pass,
  }));
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [keyHidden, setKeyHidden] = useState(true);

  useEffect(() => {
    if (!opened) {
      setKey('');
      setName('');
    }
  }, [opened])

  const add = () => {
    const textName = name.trim();
    const textKey = key.trim();

    if (textName.length >= 100 || !textName.length) {
      return;
    }

    if (textKey.length > 32 || !textKey) {
      return;
    }

    if (keys.filter((k) => k.name === textName).length) {
      return
    }

    Actions.addSavedKey({
      name: textName,
      key: textKey,
      savedKeysList: keys,
      pass,
    });
    
    close();
  }

  return (
    <Modal 
      onClose={close}
      isOpened={opened}>
      <ModalTitle title="Add new key" close={close} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input 
          style={{ width: '250px', marginBottom: '10px' }} 
          placeholder="Name" 
          onChange={(e) => setName(e.target.value)} 
          value={name} />
        <div style={{ position: 'relative' }}>
          <input 
            style={{ width: '250px', marginBottom: '10px' }} 
            placeholder="Key" 
            onChange={(e) => setKey(e.target.value)} 
            value={key} 
            type={keyHidden ? 'password' : 'text'} />
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            cursor: 'pointer'
          }} onClick={() => setKeyHidden(!keyHidden)}>
            <img src={keyHidden ? UnShowSvg : ShowSvg} />
          </div>
        </div>
      </div>
      <div className='modal-actions'>
        <button onClick={add}>Add</button>
        <button className="bg-red" onClick={close}>Close</button>
      </div>
    </Modal>
  );
};

export default KeyCreate;
