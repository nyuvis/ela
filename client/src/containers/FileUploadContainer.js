import React, { Component } from 'react';
import FileUpload from '../components/FileUpload';
import ApiService from './apiService';
import Toaster from '../components/Toaster';
import 'react-toastify/dist/ReactToastify.min.css';
import IndexFileSelectionContainer from './IndexFileSelectionContainer';
import SpinnerComponent from '../components/Spinner';

class FileUploadContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      loaded: false,
      columnList: [],
      selectedColumn: '',
      columnIndex: '',
      message: '',
      index: '',
      loading: false,
      loadingStatus: '',
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
        this.setState({
          loading: true,
          loadingStatus: 'Uploading file'
        })
        const res = await ApiService.fileUpload(this.state.file);
        if (res.status) {
          this.setState({
            loading: false,
            loadingStatus: '',
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
        this.setState({
          loading: true,
          loadingStatus: 'Uploading file'
        })
        const res = await ApiService.fileUploadToSelectColumn(this.state.file);
        if (res.status) {
          this.setState({
            message: "File Uploaded Successfully",
            columnList: res.headerList,
            loading: false,
            loadingStatus: '',
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
      if (this.state.selectedColumn && this.state.index.length) {
        this.setState({
          loading: true,
          loadingStatus: 'Building Collection....'
        })
        const res = await ApiService.fileUploadToBuildIndex(
          this.state.file, 
          this.state.selectedColumn,
          this.state.index);
        if (res.status) {
          this.setState({
            loading: false,
            loadingStatus: '',
            message: "Collection built Successfully",
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
    this.setState({ [e.target.name]: e.target.value.toLowerCase() })
  }

  render() {
    return (
      <div>
        {this.state.loading && (<SpinnerComponent message={this.state.loadingStatus} />)}
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
            />
            }
      </div>
    );
  }
}

export default FileUploadContainer;