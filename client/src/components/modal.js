import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

import { Toast, ToastBody, ToastHeader } from 'reactstrap';

class ItemModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      name: ''
    }
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  onSubmit = e => {
    e.preventDefault();
    this.toggle();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div>
        
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            >
              <ModalBody>
              <Toast>
              <ToastBody>
                This is a toast on a success background — check it out!
              </ToastBody>
            </Toast>
              </ModalBody>
            </Modal>
      </div>
    )
  }
}



export default ItemModal;

