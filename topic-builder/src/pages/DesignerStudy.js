import React, { PureComponent } from "react";
import {
    getDataset,
    getLabelSets,
    setLabelSet as setLabelSetAPI
} from "../lib/queries";
import { cleanResult } from "../lib/api";
import { startCase } from "lodash";
import { Spin } from "antd";
import queryString from "query-string";
import SidePanel from "../views/SidePanel";
import SpecificationView from "../views/SpecificationView";
import SystemBarView from "../views/SystemBarView";
import styled from "styled-components";
import { select, setPersist } from "../lib/store";
import ProjectionPanel from "../views/panels/ProjectionPanel";
import InfoPanel from "../views/panels/InfoPanel";
import InstersectionPanel from "../views/panels/IntersectionPanel";
import WordSimilarityPanel from "../views/panels/WordSimilarityPanel";
import LDAPanel from "../views/panels/LDAPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import {
    DETAILS_PANEL_SIZE,
    DISCOVERY_PANEL_SIZE
} from "../lib/reducers/layout";

const Container = styled.div`
    background-color: white;
    display: flex;
    height: 100%;
    flex-direction: column;
`;

const Body = styled.div`
    background-color: white;
    flex: 1;
    display: flex;
`;

const DiscoveryPanels = [
    {
        Title: "Projection",
        Component: ProjectionPanel
    },
    {
        Title: "LDA",
        Component: LDAPanel
    },
    {
        Title: "Word Similarity Seeds",
        Component: WordSimilarityPanel
    }
];

const DetailsPanels = [
    {
        Title: "Info",
        Component: InfoPanel
    },
    {
        Title: "Intersection",
        Component: InstersectionPanel
    }
];

class Designer extends PureComponent {
    async componentWillMount() {
        const { setContext, location } = this.props;
        const { match: { params: { datasetID, labelSet } } } = this.props;
        const queryParams = queryString.parse(location.search) || {};

        let [dataset, labelSets] = await Promise.all([
            getDataset(datasetID),
            getLabelSets(labelSet)
        ]);
        let selectedLabelSet = null;

        if (labelSets.length === 0) {
            let Name = prompt(
                "Provide a name for the Label Set",
                startCase(labelSet)
            );
            selectedLabelSet = await setLabelSetAPI({
                labelSetID: labelSet,
                Name
            });
            selectedLabelSet = cleanResult(selectedLabelSet);
        } else {
            selectedLabelSet = cleanResult(labelSets)[0];
        }
        selectedLabelSet = {
            ID: selectedLabelSet.ID,
            ...selectedLabelSet.Raw
        };
        let textField = queryParams.textField;
        setPersist(
            sessionStorage.getItem("expl-userId"),
            labelSet,
            "user-study-1"
        );
        setContext(cleanResult(dataset), selectedLabelSet, { textField });
    }

    renderLoading() {
        return (
            <div style={{ margin: "70px", textAlign: "center" }}>
                <Spin />
                <div>Loading...</div>
            </div>
        );
    }

    render() {
        const { dataset, labelSet } = this.props;
        if (!dataset || !labelSet) return this.renderLoading();
        return (
            <ErrorBoundary>
                <Container>
                    <SystemBarView />
                    <Body>
                        <SidePanel
                            width={DISCOVERY_PANEL_SIZE}
                            Panels={DiscoveryPanels}
                            dataKey="discoveryPanel"
                        />
                        <SpecificationView />
                        <SidePanel
                            width={DETAILS_PANEL_SIZE}
                            side="right"
                            Panels={DetailsPanels}
                            dataKey="detailsPanel"
                        />
                    </Body>
                </Container>
            </ErrorBoundary>
        );
    }
}

export default select(["dataset", "labelSet"], ["setContext"])(Designer);
