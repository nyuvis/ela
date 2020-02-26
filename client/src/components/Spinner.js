import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerComponent = ({message}) => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      marginTop: '26%',
      marginLeft: '40%',
      zIndex: '2',
      position: 'fixed'
    }}>
      <Spinner type="grow" color="secondary" /><br />
      <span>{message}</span>
    </div>
  );
}

export default SpinnerComponent;