import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { getDiscoveryDataQuery } from "../../lib/queries";
import { select, s } from "../../lib/store";
import { get } from "lodash";

import Projection from "../../components/Projection";

import styled from "styled-components";

const PROJECTION = ["Dataset", "Select", "NLP", "Projection"];

const Container = styled.div`
    ${() => {}};
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
`;

class SeedsPanel extends PureComponent {
    constructor() {
        super();
        this.state = {};
    }

    selectProjection = selection => {};

    render() {
        const { textField, datasetId } = this.props;

        let variables = {
            field: textField,
            ID: datasetId,
            params: this.state.params
        };
        return (
            <Query query={getDiscoveryDataQuery} variables={variables}>
                {({ data, loading }) => {
                    let projectionData = get(data, PROJECTION);

                    return (
                        <Container>
                            {/* <Projection
                                data={projectionData}
                                loading={loading}
                                width={300}
                                height={200}
                                datasetId={datasetId}
                                selectIds={this.props.projectionSetSelection}
                            /> */}
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default select(
    [
        s.textField,
        s.datasetID,
        s.filter("SeedPanel", { components: ["search", "selectedLabels"] })
    ],
    ["projectionSetSelection"]
)(SeedsPanel);
