import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import FileSelect from '../components/FileSelect';

const IndexFileSelectionContainer = ({list, onSelect, selectedColumn, buildIndex, onChangeHandler, type, index }) => {
  return (
    <div>
      {list.length>0 && (
        <div>
          <FileSelect 
              list={list} 
              onSelect={onSelect}
              selectedColumn={selectedColumn}
              buildIndex={buildIndex}
            />
            {selectedColumn && (
              <div>
                <Form style={{ marginTop: '2%', marginLeft: '1%'}}>
                  <FormGroup row>
                    <Label for="elasticIndex" sm={2}>Index Name</Label>
                    <Col sm={10}>
                      <Input style={{ width: '98%' }} type="text" name="index" id="index" placeholder="Enter Index for Search" onChange={onChangeHandler}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="elasticType" sm={2}>Type</Label>
                    <Col sm={10}>
                      <Input style={{ width: '98%' }} type="text" name="type" id="elastic-type" placeholder="Enter doc" onChange={onChangeHandler}/>
                    </Col>
                  </FormGroup>
                </Form>
                <Button 
                  color="secondary"
                  on
                  disabled={!selectedColumn}
                  onClick={buildIndex}
                  style={{ marginLeft: '1%'}}>
                    Build Index
                </Button>
              </div>
            )}
            
            
          
        
        </div>)
            
      }
      
    </div>
  );
};

export default IndexFileSelectionContainer;