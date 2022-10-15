import ReactDOM from 'react-dom';
import RefreshSvg from '../../images/svg/refresh.svg';
import './index.css';

const Loader = () => {
  const portalContainer = document.getElementById('root2');

  if (!portalContainer) return null;
  
  return (
    <>
      {ReactDOM.createPortal((
        <div className='loader-wrapper'>
          <img src={RefreshSvg} />
        </div>
      ), portalContainer)}
    </>
  )
};

export default Loader;
