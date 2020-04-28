import React from 'react';
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
import ContentTable from '../components/table';

const PreviewModal = ({modal, toggle, onSubmit, onChange, previewData, column}) => {
  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        style= {{ maxWidth: "90%"}}
        >
          <ModalHeader toggle={toggle}>Preview</ModalHeader>
          <ModalBody style= {{ padding: "0rem"}}>
            <Form onSubmit={onSubmit}>
              <div style= {{ minHeight: "68vh", maxHeight: "68vh", overflowY: "scroll" }}>
                <ContentTable 
                  heading={column}
                  list={previewData}
                />
              </div>
          
              <FormGroup style={{ marginBottom: "1rem", padding: "1rem" }}>
                <Label for="items">Remove words (eg. word1, word2...)</Label>
                <Input
                  type="text"
                  name="stopwordlist"
                  id="item"
                  placeholder="Add words to remove like word1, word2...)"
                  onChange={onChange} />
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end"
                  }}>
                    <Button
                      color="dark"
                      style={{ marginTop:'2rem', marginRight: "2%",  width: "10%" }}
                      onClick={toggle}
                    >Cancel</Button>
                    <Button
                      color="dark"
                      style={{ marginTop:'2rem' , width: "10%" }}
                      onClick={onSubmit}
                    >Continue</Button>
                  </div>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
    </div>
  )
}


export default PreviewModal;

