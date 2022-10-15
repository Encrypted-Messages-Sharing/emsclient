import { useEffect, useRef } from 'react';
import './index.css';

interface DropdownProps {
  opened: boolean;
  values: {
    text: string;
    value: number | string;
  }[];
  onClose?: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | HTMLDivElement>;
  onClickItem?: (e: any) => void;
  display: 'up' | 'down';
}

const Dropdown: React.FC<DropdownProps> = ({ 
  opened, 
  values, 
  onClose,
  buttonRef,
  onClickItem,
  display
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened) {
      window.addEventListener('mousedown', handleOutsideClick)
      return () => {
        window.removeEventListener('mousedown', handleOutsideClick)
      }
    }
  }, [onClose, opened])

  const handleOutsideClick = (e: any) => {
    if (!ref.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) {
      onClose && onClose();
    }
  }

  return (
    <div 
      className={`dropdown ${opened ? 'opened' : ''}`} 
      style={{
        top: display === 'down' ? '40px' : `-${ref.current?.getBoundingClientRect().height}px`
      }}
      ref={ref}>
      {values.map((v, i) => (
        <div 
          key={`dropdownitem-${i}`}
          className='dropdown-item'
          onClick={() => onClickItem && onClickItem(v.value)}>
            {v.text}
        </div>
      ))}
    </div>
  )
}

export default Dropdown;
