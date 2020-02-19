import React from 'react';
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

const FileSelect = ({list, onSelect, selectedColumn }) => {
  return (
    <div className="dropdownSelect" style={{ marginTop: '2%', marginLeft: '1%' }}>
      <UncontrolledButtonDropdown style={{ width: ''}}>
      <DropdownToggle caret>
        {selectedColumn ? selectedColumn: 'Select Column'}
      </DropdownToggle>
      <DropdownMenu>
        {list.map((column, index)=> (
          <DropdownItem 
            key={index} 
            onClick={onSelect(column, index)}>{column}
          </DropdownItem>))}
          <DropdownItem 
            onClick={onSelect('')}>Clear
          </DropdownItem>
      </DropdownMenu>
    </UncontrolledButtonDropdown>
    
    </div>
  );
};

export default FileSelect;
