import React, { PureComponent } from "react";
import styled from "styled-components";
import Title from "./slides/Title";
import Problem from "./slides/Problem";
import ProblemGeneral from "./slides/ProblemGeneral";
import CaseStudy from "./slides/CaseStudy";
import CaseStudyResults from "./slides/CaseStudyResults";
import Pipeline from "./slides/Pipeline";
import Results1 from "./slides/Results1";
import Results2 from "./slides/Results2";
import Results3 from "./slides/Results3";
import Results4 from "./slides/Results4";
import UserStudy from "./slides/UserStudy";
import ELAIntro from "./slides/ELAIntro";
import Methododlogy from "./slides/Methododlogy";
import Closing from "./slides/Closing";
import Solutions from "./slides/Solutions";
import Ela from "./slides/Ela";

const Container = styled.div`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: rgb(242, 242, 242);
    height: 100%;
`;

const slideList = [
    Ela,
    Title,
    ProblemGeneral,
    Problem,
    Solutions,
    Pipeline,
    ELAIntro,
    CaseStudy,
    CaseStudyResults,
    UserStudy,
    Methododlogy,
    Results1,
    Results2,
    Results3,
    Results4,
    Closing
];

const ignore = new Set(["INPUT"]);

export default class Slides extends PureComponent {
    constructor() {
        super();
        this.state = {
            slide: 0
        };
    }
    prev = () => {
        this.setState(state => ({ slide: Math.max(0, state.slide - 1) }));
    };
    next = () => {
        this.setState(state => ({
            slide: Math.min(slideList.length - 1, state.slide + 1)
        }));
    };
    hotKey = event => {
        if (ignore.has(event.target.tagName)) return;

        switch (event.code) {
            case "ArrowRight":
                this.next();
                break;
            case "ArrowLeft":
                this.prev();
                break;
            default:
                break;
        }
    };
    componentDidMount() {
        document.addEventListener("keydown", this.hotKey, false);
    }
    render() {
        const Slide = slideList[this.state.slide];
        return (
            <Container>
                <Slide
                    next={() =>
                        this.setState(state => ({
                            slide: state.slide
                        }))
                    }
                />
            </Container>
        );
    }
}
