import React from 'react';
import { CustomInput, Form, FormGroup, Label, Button, Container } from 'reactstrap';

const Example = ({ handleFileSelect, uploadFileToSelectColumn, loaded })  => {
  return (
    <Container>
      <Form>
        <FormGroup>
          <Label for="exampleCustomFileBrowser">Select File and Upload to get File Columns </Label>
          <CustomInput 
            type="file"
            id="exampleCustomFileBrowser" 
            name="customFile" 
            accept= {['.csv','.tsv']}
            onChange={handleFileSelect}
          />
      </FormGroup>
    </Form>
    <Button 
      color="secondary" 
      size="lg" 
      block
      disabled={!loaded}
      onClick={uploadFileToSelectColumn}
      >Upload</Button>
    </Container>
  );
}

export default Example;