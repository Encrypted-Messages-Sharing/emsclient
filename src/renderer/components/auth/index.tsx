import { useEffect, useState } from 'react';
import Actions from 'renderer/actions';
import { AppStore } from 'renderer/store';
import Logo from '../../images/lock3.png';
import ShowSvg from '../../images/svg/show.svg';
import UnShowSvg from '../../images/svg/unshow.svg';
import Modal from '../modal';
import ModalTitle from '../modal/modalTitle';
import './index.css';

const Auth = () => {
  const [pass, setPass] = useState('');
  const [authExists, setAuthExists] = useState(false);
  const [dropModalOpened, setDropModalOpened] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAuthExists()
  }, [dropModalOpened])

  const checkAuthExists = async () => {
    const data = await window.store.isAuthExists();
    setAuthExists(data)
  }

  const authWithPass = async () => {
    if (pass.trim() && pass.trim().length <= 32) {
      const res = await Actions.authWithPass({ pass, isAuthExists: authExists});
      if (res === 'error') {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 1000)
      }
    }
  }

  const authWithoutPass = () => {
    AppStore.update({
      pass: 'nopass'
    })
  }

  const dropPass = () => {
    window.store.removeUserData();
    setDropModalOpened(false);
    setPass('');
  }

  return (
    <div className='auth'>
      <Modal isOpened={dropModalOpened} onClose={() => setDropModalOpened(false)}>
        <ModalTitle title="Are you sure you want to drop your password?" close={close} />
        <div className='modal-actions'>
          <button className='bg-red' onClick={dropPass}>Yes</button>
          <button onClick={() => setDropModalOpened(false)}>No</button>
        </div>
      </Modal>
      <div className='auth-welcome-block'>
        <img 
          src={Logo} 
          className='logo' />
        <h2>Welcome to EMS Client</h2>
        <p className='secondary' style={{ fontSize: '15px', lineHeight: '20px' }}>
          {authExists ? (
            <>
              There is a password stored so you can enter using only it.<br />
              You can also <span className='reset-link' onClick={() => setDropModalOpened(true)}>drop it</span>{' '}
              and all your saved data will be gone.
            </>
          ) : 'There is no password stored yet.'}
        </p>
        <div className="picker">
          {showError && (
            <div className="picker-error" style={{ zIndex: 100 }}>Wrong password</div>
          )}
          <div style={{
            width: '100%',
            display: 'flex',
            position: 'relative',
          }}>
            <input 
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && authWithPass()}
              style={{ flex: 1 }}
            />
            <div style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              cursor: 'pointer'
            }} onClick={() => setShowPassword(!showPassword)}>
              <img src={showPassword ? UnShowSvg : ShowSvg} />
            </div>
          </div>
          <button onClick={authWithPass}>
            ENTER
          </button>
        </div>
        <p style={{ fontWeight: '700' }}>OR</p>
        <button style={{ width: '100%' }} onClick={authWithoutPass}>
          ENTER WITHOUT PASSWORD
        </button>
      </div>
    </div>
  );
};

export default Auth;
