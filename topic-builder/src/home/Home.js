import React, { PureComponent } from "react";
import "./about.css";
import ideation from "./ideation.png";
import specifications from "./specifications.png";
import documents from "./documents.png";
import keywords from "./keywords.png";

export default class Home extends PureComponent {
    render() {
        return (
            <div className="home">
                <div id="header" style={{ height: "60px" }}>
                    <h1>Exploratory Labeling Assistant</h1>
                    <a
                        className="button2"
                        rel="noopener noreferrer"
                        target="_blank"
                        href="http://enrico.bertini.io/s/exp-labeling-uist2018.pdf">
                        Paper
                    </a>
                    <a
                        className="button"
                        href=""
                        onClick={e => {
                            e.preventDefault();
                            this.props.history.push("demo");
                        }}>
                        Launch Demo
                    </a>
                </div>
                <div className="content">
                    <div className="page" style={{ textAlign: "center" }}>
                        <h1>ELA</h1>
                        <div className="text" style={{ fontSize: "18px" }}>
                            <b>The Exploratory Labeling Assistant:</b>
                            <br />
                            Mixed-Initiative Label Curation with Large Document
                            Collections
                        </div>
                        <iframe
                            title="video"
                            src="https://player.vimeo.com/video/295095865?title=0&byline=0&portrait=0"
                            width="1000"
                            height="506"
                            frameBorder="0"
                            webkitAllowFullScreen="true"
                            mozAllowFullScreen="true"
                            allowFullScreen="true"
                        />

                        <p
                            style={{
                                width: "700px",
                                margin: "auto",
                                padding: "20px"
                            }}>
                            We define the concept of exploratory labeling: the
                            use of computational and interactive methods to help
                            analysts categorize groups of documents into a set
                            of unknown and evolving labels. While many
                            computational methods exist to analyze data and
                            build models once the data is organized around a set
                            of predefined categories or labels, few methods
                            address the problem of reliably discovering and
                            curating such labels in the first place. In order to
                            move first steps towards bridging this gap, we
                            propose an interactive visual data analysis method
                            that integrates human-driven label ideation,
                            specification and refinement with machine-driven
                            recommendations. The proposed method enables the
                            user to progressively discover and ideate labels in
                            an exploratory fashion and specify rules that can be
                            used to automatically match sets of documents to
                            labels. To support this process of ideation,
                            specification, as well as evaluation of the labels,
                            we use unsupervised machine learning methods that
                            provide suggestions and data summaries. We evaluate
                            our method by applying it to a real-world labeling
                            problem as well as through controlled user studies
                            to identify and reflect on patterns of interaction
                            emerging from exploratory labeling activities.
                        </p>
                    </div>
                    <div
                        className="page"
                        style={{ backgroundColor: "#fafafa" }}>
                        <div className="box line">
                            <h1>Label Ideation</h1>
                            <div className="text">
                                <p>
                                    Ela help users to identify labels in a
                                    collection through <b>visualizations</b> and{" "}
                                    <b>suggestions</b>.
                                </p>
                            </div>
                        </div>
                        <img
                            alt="text"
                            src={ideation}
                            style={{ width: "600px" }}
                            className="shadow"
                        />
                    </div>
                    <div className="page">
                        <img
                            alt="text"
                            src={specifications}
                            style={{ width: "500px" }}
                            className="shadow"
                        />
                        <div className="box line" style={{ padding: "70px" }}>
                            <h1>Powerful Specifications</h1>
                            <div className="text">
                                <p>
                                    The system integrates supports the creation
                                    of specifications using a combination of
                                    rules over the keywords in the document,
                                    including logical operators like AND, OR as
                                    well as{" "}
                                    <span style={{ color: "red" }}>
                                        negative
                                    </span>{" "}
                                    rules.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="page"
                        style={{ backgroundColor: "#fafafa" }}>
                        <div className="box line">
                            <h1>Realtime document matching</h1>
                            <div className="text">
                                <p>
                                    Every time the user makes a change to one of
                                    the specifications, the system computes in
                                    realtime which documents match each label
                                    created, allowing the user to explore the
                                    documents associated with each label, as
                                    well as identify intersections and mistakes
                                    in the labels.
                                </p>
                            </div>
                        </div>
                        <img
                            alt="text"
                            src={documents}
                            style={{ width: "350px" }}
                            className="shadow"
                        />
                    </div>
                    <div className="page">
                        <img
                            alt="text"
                            src={keywords}
                            style={{ width: "500px" }}
                            className="shadow"
                        />
                        <div className="box line" style={{ padding: "70px" }}>
                            <h1>Term Suggestions</h1>
                            <div className="text">
                                <p>
                                    As the user creates labels specifications,
                                    the system matches the documents and looks
                                    for terms that my improve the specification
                                    allowing it to cover a larger number of
                                    documents.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="page"
                        style={{ backgroundColor: "#ffffff" }}>
                        <a
                            className="paper-info"
                            href="http://enrico.bertini.io/s/exp-labeling-uist2018.pdf">
                            <div className="title">
                                The Exploratory Labeling Assistant:
                                Mixed-Initiative Label Curation with Large
                                Document Collections
                            </div>
                            <div className="venue">UIST 2018.</div>
                        </a>
                        <div className="links">
                            <h2>
                                <a
                                    href="http://enrico.bertini.io/s/exp-labeling-uist2018.pdf"
                                    style={{ color: "#6A30A3" }}>
                                    Paper
                                </a>
                            </h2>

                            <h2>
                                <a
                                    style={{ color: "#6A30A3" }}
                                    href=""
                                    onClick={e => {
                                        e.preventDefault();
                                        this.props.history.push("demo");
                                    }}>
                                    Demo
                                </a>
                            </h2>
                        </div>
                        <div>
                            <ul className="credits">
                                <li>
                                    Cristian Felix
                                    <br />
                                    <a href="mailto:cristian.felix@nyu.edu">
                                        cristian.felix@nyu.edu
                                    </a>
                                </li>

                                <li>
                                    Aritra Dasgupta
                                    <br />
                                    <a href="mailto:aritra.dasgupta@pnnl.gov">
                                        aritra.dasgupta@pnnl.gov
                                    </a>
                                </li>
                                <li>
                                    Enrico Bertini
                                    <br />
                                    <a href="mailto:enrico.bertini@nyu.edu">
                                        enrico.bertini@nyu.edu
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
