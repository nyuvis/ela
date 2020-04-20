import React from 'react';
import { Table } from 'reactstrap';

const ContentTable = ({heading, list}) => {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>#</th>
          <th style={{ paddingLeft: "10rem" }}>{heading}</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item, index) => {
          return (
            <tr key={"item"+index}>
              <th scope="row">{index+1}</th>
              <td>{item[heading]}</td>
          </tr>
          )
        })}
      </tbody>
    </Table>
  );
}

export default ContentTable;