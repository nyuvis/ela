import React, { PureComponent } from "react";
import styled from "styled-components";
import { measureText } from "../lib/utils";
import { sum } from "d3-array";
import SearchIcon from "react-icons/lib/fa/search";

const TAG_FONT_SIZE = 12;
const TAG_PADDING = 5;
const TAG_MARGIN = 5;

const Input = styled.input`
    width: 250px;
    font-size: ${({ theme }) => theme.sizes.base * 14}px;
    outline: none;
    border: solid 1px white;
    padding: 8px;
    transition: all 0.3s;
    &:focus {
        border-bottom: solid ${({ theme }) => theme.colors.primary}
            ${({ theme }) => theme.sizes.border}px;
    }
`;

const Container = styled.div`
    position: relative;
    width: 300px;
`;

const TagList = styled.div`
    ${() => ""} position: absolute;
    top: 0px;
    left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;
const Tag = styled.div`
    ${() => ""} background-color: #eee;
    color: #888;
    padding: ${TAG_PADDING}px;
    margin-right: ${TAG_MARGIN}px;
    font-size: ${TAG_FONT_SIZE}px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #ddd;
    }
`;

export default class SearchBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    add = () => {
        const { onAdd } = this.props;
        let { value } = this.state;
        this.setState({ value: "" });
        if (onAdd) {
            onAdd(value);
        }
    };

    remove = idx => {
        const { onRemove } = this.props;
        if (onRemove) {
            onRemove(idx);
        }
    };

    removeLast = () => {
        const { onRemove, filters = [] } = this.props;
        if (this.state.value !== "" || filters.length === 0) return;

        let idx = filters.length - 1;
        let value = filters[idx].query;
        this.setState({ value: value });
        if (onRemove) {
            onRemove(idx);
        }
    };

    getTagsWidth() {
        const { filters = [] } = this.props;
        let sizes = sum(filters.map(f => measureText(f, TAG_FONT_SIZE).width));
        let arrSize = filters.length;
        return (
            arrSize * TAG_PADDING * 2 +
            arrSize * TAG_MARGIN +
            sizes +
            TAG_MARGIN +
            20
        );
    }

    render() {
        const { filters = [] } = this.props;
        let padding = this.getTagsWidth() + 10;

        return (
            <Container>
                <Input
                    placeholder="Search"
                    style={{
                        paddingLeft: padding,
                        width: "500px"
                    }}
                    onChange={e => this.setState({ value: e.target.value })}
                    value={this.state.value || ""}
                    onKeyPress={e => {
                        if (e.key === "Enter") this.add();
                    }}
                    onKeyUp={e => {
                        if (e.key === "Backspace") {
                            this.removeLast();
                        }
                    }}
                />
                <TagList>
                    <SearchIcon style={{ color: "#ccc", marginRight: "5px" }} />
                    {filters.map((f, i) => (
                        <Tag key={i} onClick={() => this.remove(i)}>
                            {f}
                        </Tag>
                    ))}
                </TagList>
            </Container>
        );
    }
}
