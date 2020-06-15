import React, { PureComponent } from "react";
import styled from "styled-components";
import { isArray } from "lodash";

const Container = styled.div`
    ${() => ""};
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    padding-right: ${({ theme }) => theme.sizes.padding}px;
    font-weight: ${({ theme, selected }) => selected && "bold"};
    transitiom: background-color 0.3s ease, color 0.3 ease;
    padding-left: 7px;
    font-size: 13px;
    color: #999;
    border-bottom: solid 0px #eee;
    &:hover {
        background-color: #fdfcfc;
        color: ${({ theme }) => theme.colors.font};
    }
`;

const TextContainer = styled.div`
    max-height: 72px;
    padding-top: 15px;
    padding-bottom: 15px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

const Highlight = styled.span`
    color: ${({ theme }) => theme.colors.primary};
    padding: 1px 3px;
    background-color: ${({ theme }) => theme.colors.veryLightPrimary};
`;

export function parseTags(text) {
    let split1 = text.split("<em>");
    let result = [];
    let key = 0;
    for (let sec of split1) {
        let hasClosing = sec.indexOf("</em>") > -1;
        if (!hasClosing) {
            if (sec.length > 0) {
                result.push(<span key={++key}>{sec}</span>);
            }
        } else {
            let split2 = sec.split("</em>");
            result.push(<Highlight key={++key}>{split2[0]}</Highlight>);
            if (split2.length === 2) {
                if (split2[1].length > 0) {
                    result.push(<span key={++key}>{split2[1]}</span>);
                }
            }
        }
    }
    return result;
}

export class Document extends PureComponent {
    render() {
        const { document = {}, isDragging, selected } = this.props;
        let text = document.Text || "";
        return (
            <div style={{ opacity: isDragging ? 0.5 : 1 }}>
                <Container
                    score={document.Score}
                    selected={selected}
                    onClick={() => {
                        this.props.showDetails(document.ID);
                    }}>
                    <div
                        style={{
                            backgroundColor:
                                document.Score > 0
                                    ? `rgba(63,81,181, ${Math.min(
                                          1,
                                          document.Score
                                      )})`
                                    : `rgba(233,30,99, ${Math.min(
                                          1,
                                          document.Score * -1
                                      )})`,
                            minWidth: "5px",
                            marginRight: "5px",
                            height: "70px"
                        }}
                    />
                    <div
                        style={{ marginBottom: "8px" }}
                        title={`Score: ${document.Score}`}>
                        <TextContainer>
                            {isArray(text)
                                ? text.map((t, idx) => (
                                      <div key={idx}>{parseTags(t, idx)}</div>
                                  ))
                                : text.replace(/\\n/g, "")}
                        </TextContainer>
                    </div>
                </Container>
            </div>
        );
    }
}

export default Document;
