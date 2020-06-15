import React, { PureComponent } from "react";
import styled from "styled-components";
import { DragSource } from "react-dnd";
import { select, s } from "../lib/store";
import { toggleItem } from "../lib/utils";
import { Transition, TransitionGroup } from "react-transition-group";
import { intersection, uniqBy } from "lodash";
import { max } from "d3-array";

const TopicItem = styled.div`
    padding: 5px 20px;
    cursor: pointer;

    border-radius: 5px;
    transition: all 0.3s;
    border: ${({ selected }) =>
        selected ? "solid 2px #4886fd" : "solid 1px #ddd"};
    &:hover {
        box-shadow: 0px 0px 20px #ccc;
        border: ${({ selected }) =>
            selected ? "solid 2px #4886fd" : "solid 1px #4886fd"};
    }
`;

const Container = styled.div`
    & .slide-entered {
        background-color: "red";
    }
`;

const Word = styled.div`
    &:hover {
        color: red;
    }
`;

const selectKeywords = (topic, keywords) => {
    return {
        ...topic,
        Keywords:
            keywords.length > 0
                ? topic.Keywords.filter(k => keywords.indexOf(k.Keyword) > -1)
                : topic.Keywords
    };
};

class Item extends PureComponent {
    constructor() {
        super();
        this.state = {
            selectedKeywords: []
        };
    }

    isSelected(word) {
        return this.state.selectedKeywords.indexOf(word) >= 0;
    }
    render() {
        const {
            topic,
            connectDragSource,
            isDragging,
            className,
            setSelectedSuggestion,
            selected,
            updateSelectedSuggestion
        } = this.props;

        return connectDragSource(
            <div
                className={className}
                onClick={() => {
                    setSelectedSuggestion(
                        selectKeywords(topic, this.state.selectedKeywords),
                        undefined,
                        this.props.ID
                    );
                }}
                style={{
                    margin: "15px 10px",
                    opacity: isDragging ? 0.1 : 1
                }}>
                <TopicItem selected={selected}>
                    <div>
                        <b style={{ color: "#999" }}>{topic.Topic}</b>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {topic.Keywords.map(k => (
                            <Word
                                onClick={e => {
                                    e.stopPropagation();
                                    let newSelection = toggleItem(
                                        this.state.selectedKeywords,
                                        k.Keyword
                                    );
                                    this.setState({
                                        selectedKeywords: newSelection
                                    });

                                    if (selected) {
                                        updateSelectedSuggestion(
                                            selectKeywords(topic, newSelection),
                                            false,
                                            this.props.ID
                                        );
                                    }
                                }}
                                style={{
                                    fontWeight: this.isSelected(k.Keyword)
                                        ? "bold"
                                        : null,
                                    color: this.isSelected(k.Keyword)
                                        ? "#4886fd"
                                        : null,
                                    padding: "1px 5px",
                                    margin: "2px"
                                }}
                                key={k.Keyword}>
                                {k.Keyword}
                            </Word>
                        ))}
                    </div>
                </TopicItem>
            </div>
        );
    }
}

const ItemSource = {
    beginDrag(props, monitor, component) {
        let selectedKeywords = component.state.selectedKeywords;
        let topic = selectKeywords(props.topic, selectedKeywords);
        return {
            topic: topic,
            source: props.ID || "Suggestion",
            usedSubset: !!selectedKeywords && selectedKeywords.length > 0
        };
    },
    endDrag(props, monitor, component) {
        if (monitor.didDrop()) {
            props.ignore(props.topic);
        }
    }
};

const DraggableItem = DragSource(
    "SEED_SUGGESTION",
    ItemSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    })
)(Item);

const duration = 500;

const defaultStyle = {
    maxHeight: 0,
    transition: `max-height ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    opacity: 0,
    overflow: "hidden"
};

const transitionStyles = {
    entering: { maxHeight: 0, opacity: 0 },
    entered: { maxHeight: 500, opacity: 1 }
};

const Fade = ({ children, ...props }) => {
    return (
        <Transition {...props} timeout={duration}>
            {state => (
                <div
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                    {children}
                </div>
            )}
        </Transition>
    );
};

const distance = (set1, set2) => {
    let setIntersection = intersection(set1, set2);
    let interSize = setIntersection.length;
    let prop1 = interSize / set1.length;
    let prop2 = interSize / set2.length;
    return Math.max(prop1, prop2);
};

class TopicSuggestions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ignore: {}
        };
    }
    render() {
        const {
            data = [],
            labels = [],
            setSelectedSuggestion,
            updateSelectedSuggestion,
            selectedSuggestion = {}
        } = this.props;

        let labelsKeywords = labels.map(l => l.Rules.map(r => r.rule));
        let filteredData = data;
        if (labels.length > 0) {
            filteredData = data.filter(
                d =>
                    max(
                        labelsKeywords.map(l =>
                            distance(d.Keywords.map(k => k.Keyword), l)
                        )
                    ) < 0.7
            );
        }
        filteredData = uniqBy(filteredData, d => d.Topic);

        return (
            <Container
                style={{
                    overflow: "auto",
                    marginTop: "10px",
                    borderTop: "solid 1px #999"
                }}>
                <TransitionGroup className="todo-list">
                    {filteredData.map(d => (
                        <Fade key={d.Topic}>
                            <DraggableItem
                                ID={this.props.ID}
                                setSelectedSuggestion={setSelectedSuggestion}
                                updateSelectedSuggestion={
                                    updateSelectedSuggestion
                                }
                                selected={selectedSuggestion.Topic === d.Topic}
                                key={d.Topic}
                                ignore={() => this.props.ignore}
                                topic={d}
                            />
                        </Fade>
                    ))}
                </TransitionGroup>
                <div style={{ height: "100px" }} />
            </Container>
        );
    }
}

export default select(
    [s.labels, "selectedSuggestion:filter.selectedSuggestion"],
    ["setSelectedSuggestion", "updateSelectedSuggestion"]
)(TopicSuggestions);
