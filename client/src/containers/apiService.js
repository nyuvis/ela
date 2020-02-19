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

  fileUploadToBuildIndex = (fileName, column, columnIndex, indexName, type) => {
    try {
      const data = {
        fileName,
        column,
        columnIndex,
        indexName,
        type
      };
      return axios
        .post(`${process.env.REACT_APP_TO_DO_ITEMS_API}/buildIndex`, data)
        .then(res => res.data)
    } catch (err) {
      console.log('File upload failed...', err);
    }
  }
}

export default new ApiService();


