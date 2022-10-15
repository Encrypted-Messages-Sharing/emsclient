import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppStore, StoreState } from "renderer/store";
import Dropdown from "../dropdown";

const AutoKeySetter = () => {
  const { keys, autoKey } = useSelector((state: StoreState) => ({
    keys: state.app.savedKeys,
    autoKey: state.app.autoKey,
  }));
  const [opened, setOpened] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const setAutoKey = (v: string) => {
    AppStore.update({
      autoKey: keys.find((k) => k.value === v)
    });
    setOpened(false);
  }

  const reset = () => {
    AppStore.update({
      autoKey: null
    });
  }

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div 
        className="event-channel set-key" 
        ref={buttonRef}
        onClick={() => autoKey ? reset() : setOpened(!opened)}>
          {autoKey ? `${autoKey.name} (click to reset)` : 'SET AUTO KEY'}
      </div>
      <Dropdown 
        opened={opened}
        values={keys.map((k) => ({
          text: k.name,
          value: k.value
        }))} 
        display='down'
        buttonRef={buttonRef}
        onClose={() => setOpened(false)}
        onClickItem={setAutoKey} />
    </div>
      
  )
}

export default AutoKeySetter;
