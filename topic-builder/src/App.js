import React, { Component } from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "react-apollo";
import { DragDropContextProvider } from "react-dnd";

import theme from "./lib/theme";
import { useTheme } from "./lib/utils";
import Home from "./home/Home";
import Designer from "./pages/Designer";
import DesignerStudy from "./pages/DesignerStudy";
import Study from "./pages/Study";
import Eval from "./pages/Eval";
import { client } from "./lib/api";
import "./App.css";
import store from "./lib/store";
import CommmandBar from "./views/CommandBar";
import Slides from "./presentation/Slides";
import Demo from "./pages/Demo2";
class App extends Component {
    componentWillMount() {
        useTheme(theme);
    }
    render() {
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <ThemeProvider theme={theme}>
                            <Router basename={process.env.REACT_APP_BASE}>
                                <div className="App">
                                    <CommmandBar />
                                    <Switch>
                                        <Route
                                            exact
                                            path="/uist"
                                            component={Slides}
                                        />
                                        <Route
                                            exact
                                            path="/study"
                                            component={Study}
                                        />
                                        <Route
                                            exact
                                            path="/eval"
                                            component={Eval}
                                        />
                                        <Route
                                            exact
                                            path="/demo"
                                            component={Demo}
                                        />
                                        <Route
                                            exact
                                            path="/study/:datasetID"
                                            component={Study}
                                        />
                                        <Route
                                            exact
                                            path="/study/:datasetID/:labelSet"
                                            component={DesignerStudy}
                                        />
                                        <Route
                                            exact
                                            path="/:datasetID/:mapID"
                                            component={Designer}
                                        />
                                        <Route
                                            exact
                                            path="/:datasetID/"
                                            component={Home}
                                        />
                                        <Route
                                            exact
                                            path="/home"
                                            component={Home}
                                        />

                                        <Route
                                            exact
                                            path="/"
                                            component={Home}
                                        />
                                    </Switch>
                                </div>
                            </Router>
                        </ThemeProvider>
                    </ApolloProvider>
                </Provider>
            </DragDropContextProvider>
        );
    }
}

export default App;
