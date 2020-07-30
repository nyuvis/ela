import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import AppNavbar from './components/AppNavbar';
import FileUploadContainer from './containers/FileUploadContainer';
import SearchContainer from "./containers/SearchContainer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'reactstrap';
import { v4 as uuid } from 'uuid';
import Toaster from './components/Toaster';
import 'react-toastify/dist/ReactToastify.min.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: uuid(),
      toastMessage: ''
    }
    // this.eventSource = new EventSource(`${process.env.REACT_APP_TO_DO_ITEMS_API}/sse/:${this.state.userId}`);
  }

  componentDidMount() {
    // Initialize Event source if browser supports
    this.eventSource = new EventSource(`${process.env.REACT_APP_TO_DO_ITEMS_API}/sse/:${this.state.userId}`);
      this.eventSource.onopen = () => {
        console.log("connection open");
      }
      this.eventSource.onmessage = e => this.onServerSentEventMessage(e);
      this.eventSource.onerror = e => this.onServerSentEventError(e);
  }

  componentWillUnmount(){
    // here we can send the close connection request for server sent events if there is one created
    this.eventSource.close()
  }

  onServerSentEventMessage = (event) => {
    const message = JSON.parse(event.data);
    const messageType = message.type;
    if( messageType === "service_status") {
      this.setToastMessage(message["data"]);
    }
  }

  onServerSentEventError = (error) => {
    console.log(error);
  }

  setToastMessage = (toastMessage) => {
    this.setState({
      toastMessage,
    })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <AppNavbar />
          <Container>
            {this.state.toastMessage && <Toaster message={this.state.toastMessage} autoClose={false}/>}
            <Switch>
              <Route exact path="/">
                <FileUploadContainer 
                  userId={this.state.userId}
                  setToastMessage= {this.setToastMessage}
                  />
              </Route>
              <Route path="/search">
                <SearchContainer 
                  setToastMessage= {this.setToastMessage}
                />
              </Route>
            </Switch>
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
