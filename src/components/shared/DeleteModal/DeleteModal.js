import './DeleteModal.scss';
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';

class DeleteModal extends React.Component {
  static propTypes = {
    modalIsOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    deleteFunc: PropTypes.func,
  }

  render() {
    const { deleteFunc, modalIsOpen, toggleModal } = this.props;

    return (
      <div className='DeleteModal'>
        <Modal isOpen={modalIsOpen} toggle={toggleModal} className='deleteVerifyModal'>
          <ModalBody>
            <p className='verifyDelete'>Are you sure you want to delete your journal entry?</p>
            <p>This cannot be recovered.</p>
          </ModalBody>
          <ModalFooter className='d-flex justify-content-between'>
            <Button className='deleteBtn' onClick={deleteFunc}>Delete</Button>{' '}
            <Button className='dismissDelete' onClick={toggleModal}>Keep</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DeleteModal;
