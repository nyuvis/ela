import React, { Component } from 'react';
import FileUpload from '../components/FileUpload';
import ApiService from './apiService';
import Toaster from '../components/Toaster';
import 'react-toastify/dist/ReactToastify.min.css';
import IndexFileSelectionContainer from './IndexFileSelectionContainer';

class FileUploadContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      loaded: false,
      message: '',
      columnList: [],
      selectedColumn: '',
      columnIndex: '',
      type: '',
      index: '',
    };
  }

  handleFileSelect = (event) => {
    // event.preventDefault();
    const file = event.target.files[0];
    this.setState({
      file,
      loaded: true
    })
  }

  uploadFile = async () => {
    try {
      if (this.state.loaded) {
        const res = await ApiService.fileUpload(this.state.file);
        if (res.status) {
          this.setState({
            message: "File Uploaded Successfully"
          })
          setTimeout(() =>{
            this.setState({
              message: '',
              loaded: false
            })
          }, 5000);
          };
      }
    } catch (error) {
      console.log(error);
    } 
  }

  uploadFileToSelectColumn = async () => {
    try {
      if (this.state.loaded) {
        const res = await ApiService.fileUploadToSelectColumn(this.state.file);
        if (res.status) {
          this.setState({
            message: "File Uploaded Successfully",
            columnList: res.headerList
          })
          setTimeout(() =>{
            this.setState({
              message: '',
              loaded: false,
            })
          }, 2000);
          };
      }
    } catch (error) {
      console.log(error);
    } 
  }

  onColumnSelect = (Column, ind) => () => {
    this.setState({
      selectedColumn: Column,
      columnIndex: ind
    })
  }

  buildIndex = async () => {
    try {
      if (this.state.selectedColumn && this.state.type.length && this.state.index.length) {
        const res = await ApiService.fileUploadToBuildIndex(
          this.state.file.name, 
          this.state.selectedColumn, 
          this.state.columnIndex, 
          this.state.index, 
          this.state.type);
        if (res.status) {
          this.setState({
            message: "Index built Successfully",
          })
          setTimeout(() =>{
            this.setState({
              message: '',
            })
          }, 2000);
          };
      }
    } catch (error) {
      console.log(error);
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div>
        {this.state.message && <Toaster message={this.state.message} />}
          <FileUpload
            handleFileSelect={this.handleFileSelect}
            uploadFileToSelectColumn={this.uploadFileToSelectColumn}
            loaded={this.state.loaded}
          />
          {this.state.columnList.length>0 && 
            <IndexFileSelectionContainer
              list={this.state.columnList} 
              onSelect={this.onColumnSelect}
              selectedColumn={this.state.selectedColumn}
              buildIndex={this.buildIndex}
              onChangeHandler={this.onChangeHandler}
              type={this.state.type}
              index={this.state.index}
            />
            }
      </div>
    );
  }
}

export default FileUploadContainer;