import React, { PureComponent } from "react";
import { Input, Button, Checkbox } from "antd";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { get, set } from "lodash";
import { Query } from "react-apollo";

const getModels = gql`
    query getModels($users: [String]) {
        Store(ID: "exploratory-labeling") {
            Collection(ID: "label-sets", restrictToUser: false) {
                ID
                Name
                Select(filter: { field: "_userID", in: $users }) {
                    Size
                    Documents {
                        Raw
                    }
                }
            }
        }
    }
`;

const ACTUAL_CATEGORY = [
    { ex: 0, id: "Lawyers", value: 1000 },
    { ex: 3, id: "Airports", value: 1046 },
    { ex: 8, id: "Real Estate", value: 1123 },
    { ex: 15, id: "Pets", value: 1232 },
    { ex: 24, id: "Doctors", value: 1371 },
    { ex: 35, id: "Auto Repair", value: 1541 },
    { ex: 48, id: "Hotels", value: 1743 },
    { ex: 63, id: "Beauty & Spas", value: 1975 },
    { ex: 80, id: "Restaurants", value: 2238 }
];

class Eval extends PureComponent {
    constructor() {
        super();

        this.state = { selection: {} };
        if (sessionStorage.getItem("expl-userId")) {
            this.state.user = sessionStorage.getItem("expl-userId");
        }
        if (sessionStorage.getItem("expl-token")) {
            this.state.auth = true;
        }
    }

    async sigIn(userId) {
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
                userId: userId
            }
        });
        let token = get(result, ["data", "System", "guestSession", "token"]);
        sessionStorage.setItem("expl-token", token);
        sessionStorage.setItem("expl-userId", userId);
        this.setState({
            auth: true
        });
    }

    persistSelection = () => {
        let user = sessionStorage.getItem("expl-userId");
        localStorage.setItem(
            `ela-eval-${user}`,
            JSON.stringify(this.state.selection)
        );
    };

    filterData(data) {
        if (data && Object.keys(data).length > 0) {
            return data.Store.Collection.Select.Documents.map(
                d => d.Raw
            ).filter(d => {
                return (
                    d.Name === "Study 2" || d._userID === "user10@study1.expl"
                );
            });
        }
        return [];
        // return data.filter(d => {
        //     d.
        // })
    }

    render() {
        const { user, auth } = this.state;
        let variables = {
            users: [
                "user10@study1.expl",
                "user11@study1.expl",
                "user12@study1.expl"
            ]
        };
        return (
            <div style={{ padding: "20px" }}>
                <div>
                    User:{" "}
                    <Input
                        style={{ width: "200px" }}
                        onChange={e => this.setState({ user: e.target.value })}
                        value={user}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            this.sigIn(user);
                        }}>
                        Start
                    </Button>
                    {auth && (
                        <Query query={getModels} variables={variables}>
                            {({ data }) => {
                                data = this.filterData(data);
                                return (
                                    <div
                                        style={{
                                            borderTop: "solid 1px #000",
                                            marginTop: "10px"
                                        }}>
                                        {data.map(d => (
                                            <div key={d._userID}>
                                                <div>
                                                    <h2>
                                                        Participant: {d._userID}
                                                    </h2>
                                                </div>
                                                <ul>
                                                    {d.Labels.filter(
                                                        d => d.Name !== "NOISE"
                                                    ).map(l => (
                                                        <li
                                                            style={{
                                                                borderBottom:
                                                                    "solid 1px #999"
                                                            }}
                                                            key={l.Name}>
                                                            <b>{l.Name}</b>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    color:
                                                                        "#999"
                                                                }}>
                                                                {ACTUAL_CATEGORY.map(
                                                                    c => (
                                                                        <div
                                                                            key={
                                                                                c.id
                                                                            }
                                                                            style={{
                                                                                padding:
                                                                                    "5px"
                                                                            }}>
                                                                            <Checkbox
                                                                                onChange={e => {
                                                                                    let selection = this
                                                                                        .state
                                                                                        .selection;

                                                                                    set(
                                                                                        selection,
                                                                                        [
                                                                                            d._userID,
                                                                                            l.Name,
                                                                                            c.id
                                                                                        ],
                                                                                        e
                                                                                            .target
                                                                                            .checked
                                                                                    );

                                                                                    this.setState(
                                                                                        {
                                                                                            selection
                                                                                        },
                                                                                        () =>
                                                                                            this.persistSelection()
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {" " +
                                                                                c.id}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        </Query>
                    )}
                </div>
            </div>
        );
    }
}

export default withApollo(Eval);
