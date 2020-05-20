import React, { Component } from "react";
import ReactDOM from "react-dom";
import GraphiQL from "graphiql";
import "graphiql/graphiql.css";
import "./App.css";

const API_URL = "http://localhost:5000";

class App extends Component {
    constructor() {
        super();
        this.state = {
            loginForm: { email: "", password: "" },
            token: localStorage.getItem("auth_token"),
            errors: []
        };
    }

    graphQLFetcher = graphQLParams => {
        return fetch(API_URL + "/api", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.state.token
            },
            body: JSON.stringify(graphQLParams)
        }).then(response => response.json());
    };

    signUp = async () => {
        let result = await this.graphQLFetcher({
            query: `mutation valiables($email: String!, $password: String!){
                System{
                  signIn(email: $email, password: $password) {
                    token
                  }
                }
            }`,
            variables: {
                email: this.state.loginForm.email,
                password: this.state.loginForm.password
            }
        });
        if (result.errors) {
            console.error(result.errors);
            this.setState({
                errors: result.errors
            });
        } else {
            localStorage.setItem(
                "texas:auth_token",
                result.data.System.signIn.token
            );
            localStorage.setItem("texas:auth", true);
            this.setState({
                token: result.data.System.signIn.token,
                errors: [],
                loginForm: { email: "", password: "" }
            });
        }
    };

    renderLogin() {
        return (
            <div className="container">
                <div className="login-window">
                    <div className="errors">
                        {this.state.errors.map((d, i) => (
                            <div key={i}>{d.message}</div>
                        ))}
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input
                            value={this.state.loginForm.email}
                            onChange={e =>
                                this.setState({
                                    loginForm: {
                                        ...this.state.loginForm,
                                        email: e.target.value
                                    }
                                })
                            }
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={this.state.loginForm.password}
                            onChange={e =>
                                this.setState({
                                    loginForm: {
                                        ...this.state.loginForm,
                                        password: e.target.value
                                    }
                                })
                            }
                        />
                    </div>
                    <div className="controls">
                        <button onClick={this.signUp}>Login</button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (!this.state.token) {
            return this.renderLogin();
        }
        return (
            <div className="App">
                <GraphiQL fetcher={this.graphQLFetcher} />
            </div>
        );
    }
}

export default App;
