import CloseSvg from '../../images/svg/close.svg';

interface ModalTitleProps {
  title: string;
  close: () => void;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ title, close }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  }}>
    <p>{title}</p>
    <img 
      src={CloseSvg} 
      style={{ cursor: 'pointer', marginLeft: '20px' }} 
      onClick={close} />
  </div>
);

export default ModalTitle;
