import { useSelector } from 'react-redux';
import { StoreState } from 'renderer/store';
import './index.css';

const Notify = () => {
  const { message, type } = useSelector((state: StoreState) => state.notify);

  if (!message) return <></>;
  return (
    <div className={`notify ${type}`}>
      {message}
    </div>
  )
}

export default Notify;