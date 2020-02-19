import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerComponent = (props) => {
  return (
    <div>
      <Spinner type="grow" color="secondary" />
    </div>
  );
}

export default SpinnerComponent;