import React, { PureComponent } from "react";
import { sumBy, range } from "lodash";
import styled from "styled-components";

const CELL_WIDTH = 450;

const Cell = styled.div`
    position: absolute;
    transition: top 0.3s ease, left 0.3s ease;
`;

class CardGrid extends PureComponent {
    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        if (this.props.data) {
            this.setLayout(this.props.data, this.props);
        }
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.data) {
            this.setLayout(nextProps.data, nextProps);
        }
    };
    isWindowAvailable(matrix, startPoint, endPoint) {
        let points = this.getPoints(startPoint, endPoint);
        for (let p of points) {
            if (matrix[p.row][p.col] !== -1) {
                return false;
            }
        }
        return true;
    }
    isAvaliable(matrix, p) {
        return matrix[p.row][p.col] === -1;
    }

    usePlace(matrix, p, ID) {
        matrix[p.row][p.col] = ID;
    }
    setLayout(data, { width, baseCellWidth = CELL_WIDTH, expandedSize = 4 }) {
        width = width - 10;

        const numColumns = Math.max(Math.floor(width / baseCellWidth), 2);
        const totalCells = sumBy(
            data,
            ({ expanded }) => (expanded ? +expandedSize : 1)
        );
        const numRows = Math.ceil(totalCells / numColumns) + 1;

        const placementMatrix = range(0, numRows).map(d =>
            range(0, numColumns).map(d => -1)
        );
        const getCoordinates = idx => ({
            row: Math.floor(idx / numColumns),
            col: idx % numColumns
        });

        let locations = {};

        for (let d of data) {
            for (let idx = 0; idx < totalCells; idx++) {
                if (d.expanded) {
                    let startPoint = getCoordinates(idx);
                    let endPoint = {
                        row: startPoint.row + Math.floor(expandedSize / 2 - 1),
                        col: startPoint.col + 1
                    };
                    let available = this.isWindowAvailable(
                        placementMatrix,
                        startPoint,
                        endPoint
                    );
                    if (available) {
                        this.useWindow(
                            placementMatrix,
                            startPoint,
                            endPoint,
                            d.ID
                        );
                        locations[d.ID] = startPoint;
                        break;
                    }
                } else {
                    let point = getCoordinates(idx);
                    if (this.isAvaliable(placementMatrix, point)) {
                        this.usePlace(placementMatrix, point, d.ID);
                        locations[d.ID] = point;
                        break;
                    }
                }
            }
        }
        const screenLocations = {};
        const cellWidth = width / numColumns;
        const cellHeight = 150;

        for (let ID in locations) {
            let point = locations[ID];
            screenLocations[ID] = {
                x: point.col * cellWidth,
                y: point.row * cellHeight
            };
        }

        this.setState({
            screenLocations,
            width,
            cellWidth,
            cellHeight
        });
    }
    getPoints(startPoint, endPoint) {
        let points = [];
        for (let r = startPoint.row; r <= endPoint.row; r++) {
            for (let c = startPoint.col; c <= endPoint.col; c++) {
                points.push({ row: r, col: c });
            }
        }
        return points;
    }
    useWindow(matrix, startPoint, endPoint, ID) {
        let points = this.getPoints(startPoint, endPoint);
        for (let p of points) {
            matrix[p.row][p.col] = ID;
        }
        return matrix;
    }
    render() {
        const {
            data,
            children,
            cellPadding = 10,
            expandedSize = 4
        } = this.props;
        const { screenLocations, cellWidth, cellHeight } = this.state;
        return (
            <div style={{ position: "relative" }}>
                {data.map((d, i) => (
                    <Cell
                        style={{
                            top: screenLocations[d.ID]
                                ? screenLocations[d.ID].y
                                : 0,
                            left: screenLocations[d.ID]
                                ? screenLocations[d.ID].x
                                : 0,
                            width: d.expanded ? cellWidth * 2 : cellWidth,
                            height: d.expanded
                                ? cellHeight * expandedSize / 2
                                : cellHeight,
                            padding: cellPadding
                        }}
                        key={d.ID}>
                        {children(d, {
                            width:
                                (d.expanded ? cellWidth * 2 : cellWidth) -
                                cellPadding,
                            height:
                                (d.expanded
                                    ? cellHeight * expandedSize / 2
                                    : cellHeight) - cellPadding
                        })}
                    </Cell>
                ))}
            </div>
        );
    }
}

export default CardGrid;
