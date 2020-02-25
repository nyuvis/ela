import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerComponent = ({message}) => {
  return (
    <div style={{ 
      display: 'flex',
    justifyContent: 'center',
    marginTop: '23%'
    }}>
      <Spinner type="grow" color="secondary" /><br />
      <span>{message}</span>
    </div>
  );
}

export default SpinnerComponent;