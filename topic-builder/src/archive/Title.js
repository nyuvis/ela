import React, { PureComponent } from "react";
import styled from "styled-components";
import { Slide, SlideSubTitle, SlideTitle } from "./Primitives";

export const H1 = styled.h1``;

const TitleBlock = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -100%);
  text-align: center;
`;

const BottonBar = styled.div`
  position: absolute;
  bottom: 0px;
  height: 10vh;
  width: 100%;
  background-color: #7888a0;
`;

const Authors = styled.div`
  font-size: 4vh;
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translate(-50%, -100%);
`;

export default class Title extends PureComponent {
  render() {
    return (
      <Slide onClick={() => this.props.next()}>
        <TitleBlock>
          <SlideTitle>The Exploratory Labeling Assistant: </SlideTitle>
          <SlideSubTitle>
            Mixed-Initiative Label Curation with Large Document Collections
          </SlideSubTitle>
        </TitleBlock>
        <Authors>
          <b>Cristian Felix</b>, Aritra Dasgupta, Enrico Bertini
        </Authors>
        <BottonBar />
      </Slide>
    );
  }
}
