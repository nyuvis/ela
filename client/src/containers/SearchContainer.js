import React, { Component } from 'react';
import { 
  Container,
  Button, FormGroup, Label, Input, Alert   } from 'reactstrap';
import styled from 'styled-components';
import ApiService from './apiService';

class SearchContainer extends Component {
  state = {
    searchIndex: '',
    searchResult: '',
    availableIndexes: [],
    totalNoOfrecords: '',
    hits: '',
    pageNo: '',
    dropdownOpen: true,
    loading: false,
    searchOffset: 0,
    searchTerm: '',
    baseState: {},
    showAlert: false,
  }

  async componentWillMount() {
    this.setState({
      baseState: this.state
    });
    // get Available indexes
    const res = await ApiService.getAvailableIndexes();
    this.setState({
      availableIndexes: res.data,
      loading: true
    })
  }

  componentWillUnmount() {
    this.setState(this.state.baseState);
  }
  
  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  searchStore = async (e) => {
    const searchTerm = e.target.value;
    if(this.state.selectIndex) {
      if(this.state.showAlert) {
        this.setState({
          showAlert: false,
        })
      }
      this.setState({ searchTerm });
      const response = await ApiService.getSearchResultStore(this.state.selectIndex, searchTerm, 0);
      const totalHits = response.data.hits.total;
      const currentResult = response.data.hits.hits;
      this.setState({
        searchResult: currentResult,
        hits: totalHits,
      });
    }
    if(!this.state.selectIndex){
      this.setState({
        showAlert: true
      })
    }
  }

  selectIndex = (e) => {
    this.setState({
      selectIndex: e.target.value,
      searchTerm: '',
      showAlert: false,
    })
  }

  clearIndex = () => {
    this.setState({
      selectIndex: ''
    })
  }

   nextResultsPage = async () => {
    if (this.state.hits > 10 && (this.state.searchOffset + 10 < this.state.hits)) {
      const response = await ApiService.getSearchResultStore(this.state.selectIndex, this.state.searchTerm, this.state.searchOffset+10);
      const totalHits = response.data.hits.total;
      const currentResult = response.data.hits.hits;
      this.setState({
        searchResult: currentResult,
        hits: totalHits,
        searchOffset: this.state.searchOffset + 10
      });
    }
  }
  /** Get previous page of search results */
  prevResultsPage = async () => {
    let searchOffset;
    if (this.state.searchOffset - 10 < 0) { 
      searchOffset = 0; 
    } else {
      searchOffset = this.state.searchOffset - 10;
    }
    const response = await ApiService.getSearchResultStore(this.state.selectIndex, this.state.searchTerm, searchOffset);
    const totalHits = response.data.hits.total;
    const currentResult = response.data.hits.hits;
    this.setState({
      searchResult: currentResult,
      hits: totalHits,
      searchOffset,
    });
  }
  
  render() {
    return (
      <div>
        <Container>
          <StyledSearchBox>
            <div className="select-div">
              <FormGroup style={{ width: '48%', marginLeft: '2%'}}>
                <Label for="exampleSelect">Select Index</Label>
                <Input type="select" name="select" id="exampleSelect" onChange={this.selectIndex} value={this.state.selectIndex}>
                {this.state.availableIndexes.length == 0 ? (<option key="noindex" value="">No Index Present</option>): (<option key="selectindex" value="">Select Index</option>)}
                  {this.state.availableIndexes.length > 0 && this.state.availableIndexes.map((index) => {
                    return (<option key={index} value={index}>{index}</option>)
                  })}
                </Input>
              </FormGroup>
              <FormGroup style={{ width: '48%', marginLeft: '2%'}}>
                <Label for="exampleEmail">Search </Label>
                <Input style={{ width: "96%"}} type="text" name="search" value={this.state.searchTerm} id="searchTerm" onChange={this.searchStore} placeholder="Enter search term" />
              </FormGroup>
            </div>
            {this.state.showAlert &&
                (<Alert style={{marginTop: '1%'}} color="danger">
                Select the index to search.....!
              </Alert>)
              }
            {this.state.selectIndex && (
            <div className="result-container-div">
            <Label for="exampleEmail">Results: </Label>
              <div className="result-top">
                  <div>
                    <span className="result-hit">Hits: {this.state.hits} </span><br/>
                    <span className="result-hit">Displaying Results: {this.state.searchOffset}-{this.state.searchOffset+9}</span>
                  </div>
              </div>
              {this.state.searchResult.length > 0 && this.state.searchResult.map((result, index) => {
                return (
                <div key={"div1"+index} className="result">
                  <div key={"div2"+index} className="result-hit">
                    <span key={"key1"+index} >Location: {result._source.location} </span><br/>
                    <span key={"key2"+index}>{result._source.text}</span>
                  </div>
              </div>)})}
            </div>)}
            {this.state.selectIndex && (<div className="footer">
                  <div style = {{ marginTop: '2%'}}>
                  <Button style = {{ width: '49%' }} color="secondary" onClick={this.prevResultsPage}>Prev</Button>
                  <Button style = {{ width: '49%', marginLeft: '2%' }} color="secondary" onClick={this.nextResultsPage}>Next</Button>
                  </div>
            </div>)}
          </StyledSearchBox>
        </Container>
      </div>
    );
  }
}

const StyledSearchBox = styled.div`
  .select-div {
    display: flex;
    flex-direction: row;
    background-color: lightgrey;
    border-radius: 12px
  }

  .result-container-div {
    margin-top: 2%;
  }

  .result {
    margin-top: 1%;
    display: flex;
    flex-direction: column;
    background-color: #F9F7F7;
    min-height: 5%;
    border-radius: 12px;
    height: max-content;
  }

  .result-hit {
    margin: 1%;
    padding: 1%;
  }

  .result-top {
    
    margin-top: 1%;
    display: flex;
    flex-direction: column;
    background-color: lightgrey;
    min-height: 5%;
    border-radius: 12px;
    height: 3.234rem;
  }
`;

export default SearchContainer;