import axios from 'axios';

export class ApiService {

  fileUpload = (file) => {
    try {
      const data = new FormData();
      data.append('file', file);
      return axios
        .post(`${process.env.REACT_APP_TO_DO_ITEMS_API}/upload`, data ,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => res)
    } catch (err) {
      console.log('File upload failed...', err);
    }
  }

  fileUploadToSelectColumn = (file) => {
    try {
      const data = new FormData();
      data.append('file', file);
      return axios
        .post(`${process.env.REACT_APP_TO_DO_ITEMS_API}/getColumnTypes`, data ,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => res.data)
    } catch (err) {
      console.log('File upload failed...', err);
    }
  }

  fileUploadToBuildIndex = (file, column, indexName) => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('column', column);
      data.append('indexName', indexName);
      return axios
        .post(`${process.env.REACT_APP_TO_DO_ITEMS_API}/buildIndex`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => res.data)
    } catch (err) {
      console.log('File upload failed...', err);
    }
  }

  getAvailableIndexes = () => {
    try {
      return axios
        .get(`${process.env.REACT_APP_TO_DO_ITEMS_API}/getIndexes`)
        .then(res => res.data)
    } catch (err) {
      console.log(err);
    }
  }

  getSearchResultStore = (index, searchTerm, searchOffset) => {
    // const data = 
    
    try {
      return axios
        .post(`${process.env.REACT_APP_TO_DO_ITEMS_API}/search`, {
          index,
          searchTerm,
          searchOffset
        },{
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.data)
    } catch (err) {
      console.log(err);
    }
  }




}

export default new ApiService();


