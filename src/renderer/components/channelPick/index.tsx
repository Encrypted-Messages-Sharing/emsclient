import { useState } from 'react';
import { AppStore } from 'renderer/store';
import './index.css';

interface MessagesProps {
}

const Start: React.FC<MessagesProps> = () => {
  const [channel, setChannel] = useState('');

  const pickChannel = () => {
    const ch = channel.trim();
    
    if (
      ch && 
      ch.length <= 100 &&
      /[a-zA-Z\d]+/.test(ch)
    ) {
      AppStore.update({selectedChannel: ch});
    }
  }

  return (
    <div className="channel-pick">
      <h3>Pick a channel to view</h3>
      <div className="picker">
        <input 
          placeholder="Channel" 
          value={channel} 
          onChange={(e) => setChannel(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && pickChannel()}
        />
        <button 
          onClick={pickChannel}>
            Pick
        </button>
      </div>
    </div>
  );
};

export default Start;
