import React, { PureComponent } from "react";
import styled from "styled-components";

import { Slide } from "./Primitives";

const Container = styled.div`
  display: flex;
  margin: 10vh;
`;
const LeftSide = styled.div`
  text-align: center;
`;
const RightSide = styled.div``;
const Emphasis = styled.div`
  font-size: 5vh;
  font-weight: 500;
`;
const Label1 = styled.div`
  font-size: 5vh;
`;
const BuletList = styled.div``;

export default class Problem extends PureComponent {
  render() {
    const svgWidth = 40;
    const svgHeight = 50;
    const thirdSvg = svgWidth / 3;
    return (
      <Slide>
        <Container>
          <LeftSide>
            <Emphasis>Emails</Emphasis>
            <Label1>50,000</Label1>
            <svg
              height={`${svgHeight}vh`}
              width={`${svgWidth}vw`}
              style={{ border: "solid 1px #000" }}
            >
              <line
                x1={`${svgWidth / 2}vw`}
                y1="1vw"
                x2={`${svgWidth * 0.8}vw`}
                y2={`${svgHeight * 0.8}vh`}
                stroke="black"
                strokeWidth="2px"
              />
              <line
                x1={`${svgWidth / 2}vw`}
                y1="1vw"
                x2={`${svgWidth * 0.15}vw`}
                y2={`${svgHeight * 0.8}vh`}
                stroke="black"
                strokeWidth="2px"
              />
              <line
                x1={`${svgWidth / 2}vw`}
                y1="1vw"
                x2={`${svgWidth * 0.5}vw`}
                y2={`${svgHeight * 0.8}vh`}
                stroke="black"
                strokeWidth="2px"
              />
              <path d={`M10,10L50,50L40,40L10,10`} fill="black" />
              <g style={{ transform: `translate(0.5vw,${svgWidth * 0.6}vw)` }}>
                <rect
                  x="0vw"
                  width={`${thirdSvg * 0.9}vw`}
                  height="6vh"
                  fill="#AB1802"
                />
                <rect
                  x={`${thirdSvg}vw`}
                  width={`${thirdSvg * 0.9}vw`}
                  height="6vh"
                  fill="#D9971A"
                />
                <rect
                  x={`${thirdSvg * 2}vw`}
                  width={`${thirdSvg * 0.9}vw`}
                  height="6vh"
                  fill="#3D4553"
                />
              </g>
            </svg>
            <Emphasis style={{ fontWeight: 700 }}>Unknown</Emphasis>
            <Label1>Scam Types</Label1>
          </LeftSide>
          <RightSide>
            <BuletList>Labeling</BuletList>
          </RightSide>
        </Container>
      </Slide>
    );
  }
}
