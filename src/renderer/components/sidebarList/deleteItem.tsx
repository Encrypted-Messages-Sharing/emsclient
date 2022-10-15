import Modal from "../modal";
import ModalTitle from "../modal/modalTitle";

interface DeleteItemProps {
  close(): void;
  deleteItem(): void;
  opened: boolean;
  type: 'channel' | 'key'
}

const DeleteItem: React.FC<DeleteItemProps> = ({ close, opened, deleteItem, type }) => {

  return (
    <Modal 
      onClose={close}
      isOpened={opened}>
      <ModalTitle title={`Are you sure you want to delete this ${type}?`} close={close} />
      <div className='modal-actions'>
        <button onClick={() => {
          deleteItem();
          close();
        }}>Yes</button>
        <button className="bg-red" onClick={close}>No</button>
      </div>
    </Modal>
  );
};

export default DeleteItem;
