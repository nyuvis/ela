import React, { PureComponent } from "react";
import styled from "styled-components";
import tandon_logo from "../resources/tandon_logo.png";
import { Button, Input } from "antd";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fefefe+0,f1f1f1+100 */

const StudyContainer = styled.div`
    ${() => ""};
    margin: 0px;
    background-color: #f5f5f5;
    min-height: 100%;
    padding: 10px;
    background: #fefefe;
    background: linear-gradient(to bottom, #fefefe 0%, #f1f1f1 100%);
    transition: all 1s;
`;

const Container = styled.div`
    ${() => ""};
    margin: auto;
    width: 900px;
    background-color: white;
    min-height: 500px;
    box-shadow: 0px 0px 10px #ccc;
    padding: 50px;
`;

class ConsentForm extends PureComponent {
    render() {
        return (
            <div>
                <img
                    src={tandon_logo}
                    alt=""
                    width="200px"
                    style={{ marginBottom: "40px" }}
                />
                <h1 style={{ textAlign: "center" }}>
                    Consent Form for IRB Study #IRB-FY2018-1793
                </h1>
                <div>
                    <p>
                        You have been invited to take part in a research study
                        about How people identify and specify labels for
                        documents organizations. This study will be conducted by
                        Enrico Bertini, TANDON - Computer Science & Engineering
                        (CSE), Tandon School of Engineering, New York
                        University.
                    </p>
                    <p>
                        If you agree to be in this study, you will be asked to
                        do the following:
                    </p>
                    <ul>
                        <li>Participate in a 15 minutes training.</li>
                        <li>
                            Use our system to identify and specify labels for
                            documents in a text collection.
                        </li>
                        <li>
                            Participate in an interview about your experience
                            using performing the previous task.
                        </li>
                    </ul>
                    <p>
                        Your screen will be recorded with no audio during the
                        study. However the interview will not. You may review
                        these recording and request that all or any portion of
                        the tapes be destroyed.
                    </p>
                    <p>Participation in this study will take 1.5 hours</p>
                    <p>
                        There are no known risks associated with your
                        participation in this research beyond those of everyday
                        life.{" "}
                    </p>
                    <p>
                        Although you will receive no direct benefits, this
                        research may help the investigator understand how people
                        identify and specify labels for documents in text
                        collections
                    </p>
                    <p>
                        You will receive 30 US Dollars for completing the task
                    </p>
                    <p>
                        Confidentiality of your research records will be
                        strictly maintained by assigning code numbers to each
                        participant so that data is never directly linked to
                        individual identity.
                    </p>
                    <p>
                        If there is anything about the study or your
                        participation that is unclear or that you do not
                        understand, if you have questions or wish to report a
                        research-related problem, you may contact Enrico Bertini
                        at (646) 997-3731, enrico.bertini@nyu.edu, 2 MetroTech
                        Center, 10th floor, Office 10.082.
                    </p>
                    <p>
                        For questions about your rights as a research
                        participant, you may contact the University Committee on
                        Activities Involving Human Subjects, New York
                        University, 665 Broadway, Suite 804, New York, New York,
                        10012, at ask.humansubjects@nyu.edu or (212) 998-4808.
                        Please reference the study # (IRB-FY2018-1793) when
                        contacting the IRB.
                    </p>
                    <p>
                        A copy of this form can be downloaded{" "}
                        <a href="consentForm.pdf">here</a>
                    </p>
                </div>
                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <Button type="primary" onClick={this.props.nextPage}>
                        I accept the terms, and would like to participate on the
                        study
                    </Button>
                </div>
            </div>
        );
    }
}

class UserIDView extends PureComponent {
    constructor() {
        super();
        this.state = {
            userID: ""
        };
    }
    fullUserID() {
        return `user${this.state.userID}@study1.expl`;
    }
    render() {
        return (
            <div>
                <div>
                    <h2>User ID:</h2>
                </div>
                <div>
                    <Input
                        onChange={e =>
                            this.setState({ userID: e.target.value })
                        }
                        value={this.state.userID}
                    />
                </div>
                {this.state.userID && <div>FullID: {this.fullUserID()}</div>}
                <div style={{ marginTop: "20px" }}>
                    <Button
                        disabled={!this.state.userID}
                        onClick={async () => {
                            const { client } = this.props;
                            const query = gql`
                                mutation guets($userId: String) {
                                    System {
                                        guestSession(guest: $userId) {
                                            token
                                        }
                                    }
                                }
                            `;
                            let result = await client.mutate({
                                mutation: query,
                                variables: {
                                    userId: this.fullUserID()
                                }
                            });
                            let token = get(result, [
                                "data",
                                "System",
                                "guestSession",
                                "token"
                            ]);
                            sessionStorage.setItem("expl-token", token);
                            sessionStorage.setItem(
                                "expl-userId",
                                this.fullUserID()
                            );

                            this.props.changeInfo({
                                userID: this.state.userID
                            });
                            this.props.nextPage();
                        }}
                        type="primary">
                        Next
                    </Button>
                </div>
            </div>
        );
    }
}

const UserID = withApollo(UserIDView);

class TrainingIntroductionView extends PureComponent {
    render() {
        return (
            <div>
                <h2>Training</h2>
                <div>
                    We now will explain the task, the tool and the features it
                    provide to support the task.
                </div>
                <div style={{ marginTop: "30px" }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.props.history.push(
                                `/study/${this.props.match.params.datasetID ||
                                    1}/study1`
                            );
                        }}>
                        Start Training
                    </Button>
                </div>
            </div>
        );
    }
}

const TrainingIntroduction = withRouter(TrainingIntroductionView);

class Paper extends PureComponent {
    render() {
        return <Container>{this.props.children}</Container>;
    }
}

const PAGES = [ConsentForm, UserID, TrainingIntroduction];

class Study extends PureComponent {
    constructor() {
        super();
        this.state = {
            page: 0
        };
    }
    nextPage = () => {
        this.setState(state => ({ page: state.page + 1 }));
    };
    changeInfo = info => {
        this.setState({ ...info });
    };
    render() {
        const Page = PAGES[this.state.page];
        return (
            <StudyContainer>
                <Paper>
                    <Page
                        nextPage={this.nextPage}
                        changeInfo={this.changeInfo}
                    />
                </Paper>
            </StudyContainer>
        );
    }
}

export default Study;
