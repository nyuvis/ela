import React, { Component } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Toaster extends Component {

  componentDidMount() {
    this.notify(this.props.message);
  }

  notify = (message) => toast(message, {
    autoClose: this.props.autoClose
  });
  
  render () {
    return (
      <StyledToaster>
          <ToastContainer  
            position={toast.POSITION.BOTTOM_RIGHT}
            hideProgressBar
          />
      </StyledToaster>
    )
  }
}

const StyledToaster = styled.div`

.Toastify__toast--default {
  background: #6c757d;
  color: #fff;
  border-radius: .3rem;
}
`;

export default Toaster;