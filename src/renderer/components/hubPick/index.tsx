import { useState } from 'react';
import { useSelector } from 'react-redux';
import Actions from 'renderer/actions';
import { AppStore, StoreState } from 'renderer/store';
import OnionImg from '../../images/onion.png';
import Loader from '../loader';
import './index.css';

const HubPick = () => {
  const { savedHubs, pass, useTor } = useSelector((state: StoreState) => ({
    savedHubs: state.app.savedHubs,
    pass: state.app.pass,
    useTor: state.app.useTor
  }));
  const [hub, setHub] = useState('');
  const [rememberHub, setRemeberHub] = useState(false);
  const [loading, setLoading] = useState(false);

  const [torLoading, setTorLoading] = useState(false);

  const pickHub = async (argHub?: string) => {
    let selectedHub = (argHub || hub).trim();

    if (!selectedHub) return;
    selectedHub = selectedHub.replaceAll(/[?&\/]*$/g, '');

    setLoading(true)
    const res = await Actions.pickHub({
      pass,
      hub: selectedHub,
      withRemember: rememberHub,
      savedHubsList: savedHubs,
      useTor,
    });

    if (res === 'error') {
      console.log('cathced')
      Actions.sendNotify({
        message: `Failed to connect to ${selectedHub}`,
        type: 'error'
      })
    }
    setLoading(false);
  }

  const checkTor = async () => {
    setTorLoading(true);
    const res = await Actions.testTor();
    if (res) {
      AppStore.update({ useTor: true });
    }
    else {
      Actions.sendNotify({
        message: 'Failed to connect to Tor network. You probably forgot to start the Tor browser.',
        type: 'error'
      })
    }
    setTorLoading(false);
  }

  return (
    <div className='hub-pick'>
      {loading && (
        <Loader />
      )}
      <div className="hub-pick-block">
        <h3>Join a hub</h3>
        <div className="picker">
          <input 
            placeholder="Hub" 
            value={hub} 
            onChange={(e) => setHub(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && pickHub() }
          />
          <button onClick={() => pickHub()}>
              JOIN
          </button>
        </div>
        {pass !== 'nopass' && (
          <div className="remember-hub" onClick={() => setRemeberHub(!rememberHub)}>
            <div 
              className={rememberHub ? 'selected' : ''}>
              <div />
            </div>
            <p>Remember</p>
          </div>
        )}
        {!!savedHubs.length && (
          <div className="remembered-hubs-list">
            <div className="remembered-hubs-list-header">Saved Hubs</div>
            <div className="remembered-hubs-list-body">
              {savedHubs.map((hub) => (
                <div key={`savedhub-hub-${hub}`}>
                  <div className="list-hub" title={hub}>{hub}</div>
                  <div className="list-hub-actions">
                    <div className="list-hub-join-button" onClick={() => pickHub(hub)}>JOIN</div>
                    <div className="list-hub-delete-button" onClick={() => Actions.deleteSavedHub({
                      pass,
                      hub,
                      savedHubsList: savedHubs,
                    })}>DELETE</div>
                  </div>
                </div>
              ))}
            </div> 
          </div>
        )}
        <div 
          className={`tor-net ${useTor ? 'active' : ''}`} 
          onClick={!useTor ? checkTor : undefined}
          style={{
            cursor: useTor ? undefined : 'pointer'
          }}>
          <img src={OnionImg} />
          <p>
            {useTor ? 'Connected to Tor network' : torLoading ? 'Connection test...' : 'Use Tor network'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HubPick;
