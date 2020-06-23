import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import { List } from "antd";

//Style
const ContentWindow = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    transform: translate(-50%, -50%);
`;

const ListItem = styled(List.Item)`
    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
    }
    cursor: pointer;
`;

//Data Info
const getDatasets = gql`
    query getDatasets {
        Datasets {
            ID
            Name
        }
    }
`;

const showDatasets = new Set([4])

//Component
class Demo extends PureComponent {
    renderSelectDataset() {
        return (
            <Query query={getDatasets}>
                {({ data = {}, loading }) => {

                    let datasets = data.Datasets || []
                    // datasets = datasets.filter(d => showDatasets.has(+d.ID))
                    return (
                        <div>
                            <h3 style={{ marginBottom: 16 }}>
                                Select a Dataset
                            </h3>
                            <List
                                bordered
                                loading={loading}
                                dataSource={datasets}
                                renderItem={item => (
                                    <ListItem
                                        onClick={() => {
                                            this.props.history.push(
                                                `/${item.ID}/`
                                            );
                                        }}>
                                        <div>{item.Name}</div>
                                    </ListItem>
                                )}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }

    renderSelectLabelSet() {
        return <div>Select Session</div>;
    }

    render() {
        return (
            <ContentWindow>
                {!this.props.match.params.datasetID
                    ? this.renderSelectDataset()
                    : this.renderSelectLabelSet()}
            </ContentWindow>
        );
    }
}

export default Demo;
