import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Actions from "renderer/actions";
import { StoreState } from "renderer/store";
import Modal from "../modal";
import ModalTitle from "../modal/modalTitle";

interface ChannelCreateProps {
  opened: boolean;
  close(): void;
}

const ChannelCreate: React.FC<ChannelCreateProps> = ({ 
  close,
  opened
}) => {
  const { hub, channels, pass } = useSelector((state: StoreState) => ({
    hub: state.app.hub,
    channels: state.app.savedChannels,
    pass: state.app.pass,
  }));
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!opened) {
      setInput('');
    }
  }, [opened])

  const add = () => {
    const text = input.trim();

    if (text.length >= 100 || !text.length) {
      return;
    }

    Actions.addSavedChannel({
      channel: text,
      hub,
      savedChannelsList: channels,
      pass,
    });

    close();
  }

  return (
    <Modal
      isOpened={opened}
      onClose={close}
    >
      <ModalTitle title="Add new channel" close={close} />
      <input 
        style={{ width: '250px', marginBottom: '10px' }} 
        placeholder="Channel" 
        onChange={(e) => setInput(e.target.value)} 
        value={input} />
      <div className='modal-actions'>
        <button onClick={add}>Add</button>
        <button className="bg-red" onClick={close}>Close</button>
      </div>
    </Modal>
  );
};

export default ChannelCreate;
