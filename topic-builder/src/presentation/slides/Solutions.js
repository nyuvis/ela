import React, { PureComponent } from "react";

export default class Problem extends PureComponent {
    constructor() {
        super();
        this.state = {
            position: 0,
            steps: 10
        };
    }
    displayOn(position, disapear) {
        if (disapear && this.state.position >= disapear) {
            return "none";
        }
        if (this.state.position < position) {
            return "none";
        }
    }
    changePosition = e => {
        if (e.shiftKey) {
            this.setState(state => ({
                position: Math.max(0, state.position - 1)
            }));
        } else {
            this.setState(state => ({
                position: Math.min(state.steps - 1, state.position + 1)
            }));
        }
    };
    render() {
        return (
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1921 1081"
                version={1.1}
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                xmlnsSerif="http://www.serif.com/"
                style={{
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 1.41421
                }}
                onClick={this.changePosition}>
                <g transform="matrix(1,0,0,1,-4394,-1318)">
                    <g
                        id="Artboard1"
                        transform="matrix(1.02759,0,0,1.00382,2389.84,1314.55)">
                        <rect
                            x={1950.92}
                            y={4.112}
                            width={1868.44}
                            height={1075.89}
                            style={{ fill: "none" }}
                        />
                        <clipPath id="_clip1">
                            <rect
                                x={1950.92}
                                y={4.112}
                                width={1868.44}
                                height={1075.89}
                            />
                        </clipPath>
                        <g clipPath="url(#_clip1)">
                            <g transform="matrix(1.23151,0,0,1.72015,-744.124,-777.761)">
                                <rect
                                    x={2188.4}
                                    y={454.538}
                                    width={1517.19}
                                    height={625.462}
                                    style={{ fill: "#f2f2f2" }}
                                />
                            </g>
                            <g
                                id="Solutions"
                                transform="matrix(1,0,0,1,0,-88.5286)">
                                <g transform="matrix(5.17324,0,0,5.29575,-11957.2,-1005.05)">
                                    <text
                                        x="2762.88px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`Labeling`}
                                    </text>
                                </g>
                                <g transform="matrix(5.17324,0,0,5.29575,-12072.3,-901.846)">
                                    <text
                                        x="2740.63px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`Qualitative Coding`}
                                    </text>
                                </g>
                                <g transform="matrix(5.17324,0,0,5.29575,-11977.9,-685.223)">
                                    <text
                                        x="2758.88px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`Clustering`}
                                    </text>
                                </g>
                                <g transform="matrix(5.17324,0,0,5.29575,-11977.9,-577.76)">
                                    <text
                                        x="2780.76px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`LDA`}
                                    </text>
                                </g>
                                <g transform="matrix(5.17324,0,0,5.29575,-12036.7,-787.557)">
                                    <text
                                        x="2747.51px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`Active Learning`}
                                    </text>
                                </g>
                            </g>
                            <g
                                display={this.displayOn(2)}
                                id="Circles"
                                transform="matrix(1,0,0,1,0,-88.5286)">
                                <g>
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(2.4244,0,0,1.87174,-9445.19,-2863.67)">
                                        <text
                                            x="5046.09px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`-`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,0,117.343)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(2.4244,0,0,1.87174,-9445.19,-2863.67)">
                                        <text
                                            x="5046.09px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`-`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-196.395,0)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                        <text
                                            x="5033.57px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`+`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-196.395,107.695)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                        <text
                                            x="5033.57px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`+`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-1.42368,212.109)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                        <text
                                            x="5033.57px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`+`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-1.42368,319.804)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                        <text
                                            x="5033.57px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`+`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-196.395,212.109)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(0.626387,0,0,0.692159,-347.513,-753.005)">
                                        <path
                                            d="M5016.61,1791.03l0,-9.422l-9.351,0l0,-3.937l9.351,0l0,-9.352l3.985,0l0,9.352l9.351,0l0,3.937l-9.351,0l0,9.422l-3.985,0Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}
                                        />
                                        <path
                                            d="M5032.73,1797.01l9.422,-33.61l3.375,0l-9.398,33.61l-3.399,0Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}
                                        />
                                        <g transform="matrix(1.59498,0,0,1,-3004.16,-5.75391)">
                                            <rect
                                                x={5048.01}
                                                y={1783.67}
                                                width={11.672}
                                                height={4.57}
                                                style={{
                                                    fill: "#fff",
                                                    fillRule: "nonzero",
                                                    stroke: "#fff",
                                                    strokeWidth: 1
                                                }}
                                            />
                                        </g>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-196.395,322.48)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(0.626387,0,0,0.692159,-347.513,-753.005)">
                                        <path
                                            d="M5016.61,1791.03l0,-9.422l-9.351,0l0,-3.937l9.351,0l0,-9.352l3.985,0l0,9.352l9.351,0l0,3.937l-9.351,0l0,9.422l-3.985,0Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}
                                        />
                                        <path
                                            d="M5032.73,1797.01l9.422,-33.61l3.375,0l-9.398,33.61l-3.399,0Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}
                                        />
                                        <g transform="matrix(1.59498,0,0,1,-3004.16,-5.75391)">
                                            <rect
                                                x={5048.01}
                                                y={1783.67}
                                                width={11.672}
                                                height={4.57}
                                                style={{
                                                    fill: "#fff",
                                                    fillRule: "nonzero",
                                                    stroke: "#fff",
                                                    strokeWidth: 1
                                                }}
                                            />
                                        </g>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-1.42368,417.982)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                        <text
                                            x="5033.57px"
                                            y="1796.59px"
                                            style={{
                                                fontFamily:
                                                    "'GillSans', 'Gill Sans', sans-serif",
                                                fontSize: 48,
                                                fill: "#fff",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}>
                                            {`+`}
                                        </text>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-196.395,420.658)">
                                    <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                        <circle
                                            cx={5420.44}
                                            cy={1795.56}
                                            r={25.854}
                                            style={{ fill: "#6a6a6a" }}
                                        />
                                    </g>
                                    <g transform="matrix(0.626387,0,0,0.692159,-347.513,-753.005)">
                                        <path
                                            d="M5016.61,1791.03l0,-9.422l-9.351,0l0,-3.937l9.351,0l0,-9.352l3.985,0l0,9.352l9.351,0l0,3.937l-9.351,0l0,9.422l-3.985,0Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}
                                        />
                                        <path
                                            d="M5032.73,1797.01l9.422,-33.61l3.375,0l-9.398,33.61l-3.399,0Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero",
                                                stroke: "#fff",
                                                strokeWidth: 1
                                            }}
                                        />
                                        <g transform="matrix(1.59498,0,0,1,-3004.16,-5.75391)">
                                            <rect
                                                x={5048.01}
                                                y={1783.67}
                                                width={11.672}
                                                height={4.57}
                                                style={{
                                                    fill: "#fff",
                                                    fillRule: "nonzero",
                                                    stroke: "#fff",
                                                    strokeWidth: 1
                                                }}
                                            />
                                        </g>
                                    </g>
                                </g>
                            </g>
                            <g
                                id="Discovery"
                                display={this.displayOn(4)}
                                transform="matrix(1,0,0,1,0,-88.5286)">
                                <g>
                                    <g>
                                        <g transform="matrix(1,0,0,1,609.688,117.91)">
                                            <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                                <circle
                                                    cx={5420.44}
                                                    cy={1795.56}
                                                    r={25.854}
                                                    style={{ fill: "#6a6a6a" }}
                                                />
                                            </g>
                                            <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                                <text
                                                    x="5033.57px"
                                                    y="1796.59px"
                                                    style={{
                                                        fontFamily:
                                                            "'GillSans', 'Gill Sans', sans-serif",
                                                        fontSize: 48,
                                                        fill: "#fff",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}>
                                                    {`+`}
                                                </text>
                                            </g>
                                        </g>
                                        <g transform="matrix(1,0,0,1,609.688,324.519)">
                                            <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                                <circle
                                                    cx={5420.44}
                                                    cy={1795.56}
                                                    r={25.854}
                                                    style={{ fill: "#6a6a6a" }}
                                                />
                                            </g>
                                            <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                                <text
                                                    x="5033.57px"
                                                    y="1796.59px"
                                                    style={{
                                                        fontFamily:
                                                            "'GillSans', 'Gill Sans', sans-serif",
                                                        fontSize: 48,
                                                        fill: "#fff",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}>
                                                    {`+`}
                                                </text>
                                            </g>
                                        </g>
                                        <g transform="matrix(1,0,0,1,609.688,420.792)">
                                            <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                                <circle
                                                    cx={5420.44}
                                                    cy={1795.56}
                                                    r={25.854}
                                                    style={{ fill: "#6a6a6a" }}
                                                />
                                            </g>
                                            <g transform="matrix(1.42953,0,0,1.57964,-4408.34,-2332.06)">
                                                <text
                                                    x="5033.57px"
                                                    y="1796.59px"
                                                    style={{
                                                        fontFamily:
                                                            "'GillSans', 'Gill Sans', sans-serif",
                                                        fontSize: 48,
                                                        fill: "#fff",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}>
                                                    {`+`}
                                                </text>
                                            </g>
                                        </g>
                                        <g transform="matrix(1,0,0,1,610.532,220.009)">
                                            <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                                <circle
                                                    cx={5420.44}
                                                    cy={1795.56}
                                                    r={25.854}
                                                    style={{ fill: "#6a6a6a" }}
                                                />
                                            </g>
                                            <g transform="matrix(0.626387,0,0,0.692159,-347.513,-753.005)">
                                                <path
                                                    d="M5016.61,1791.03l0,-9.422l-9.351,0l0,-3.937l9.351,0l0,-9.352l3.985,0l0,9.352l9.351,0l0,3.937l-9.351,0l0,9.422l-3.985,0Z"
                                                    style={{
                                                        fill: "#fff",
                                                        fillRule: "nonzero",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}
                                                />
                                                <path
                                                    d="M5032.73,1797.01l9.422,-33.61l3.375,0l-9.398,33.61l-3.399,0Z"
                                                    style={{
                                                        fill: "#fff",
                                                        fillRule: "nonzero",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}
                                                />
                                                <g transform="matrix(1.59498,0,0,1,-3004.16,-5.75391)">
                                                    <rect
                                                        x={5048.01}
                                                        y={1783.67}
                                                        width={11.672}
                                                        height={4.57}
                                                        style={{
                                                            fill: "#fff",
                                                            fillRule: "nonzero",
                                                            stroke: "#fff",
                                                            strokeWidth: 1
                                                        }}
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                        <g transform="matrix(1,0,0,1,610.532,6.61899)">
                                            <g transform="matrix(0.973148,0,0,0.996193,-2467.53,-1309.54)">
                                                <circle
                                                    cx={5420.44}
                                                    cy={1795.56}
                                                    r={25.854}
                                                    style={{ fill: "#6a6a6a" }}
                                                />
                                            </g>
                                            <g transform="matrix(0.626387,0,0,0.692159,-347.513,-753.005)">
                                                <path
                                                    d="M5016.61,1791.03l0,-9.422l-9.351,0l0,-3.937l9.351,0l0,-9.352l3.985,0l0,9.352l9.351,0l0,3.937l-9.351,0l0,9.422l-3.985,0Z"
                                                    style={{
                                                        fill: "#fff",
                                                        fillRule: "nonzero",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}
                                                />
                                                <path
                                                    d="M5032.73,1797.01l9.422,-33.61l3.375,0l-9.398,33.61l-3.399,0Z"
                                                    style={{
                                                        fill: "#fff",
                                                        fillRule: "nonzero",
                                                        stroke: "#fff",
                                                        strokeWidth: 1
                                                    }}
                                                />
                                                <g transform="matrix(1.59498,0,0,1,-3004.16,-5.75391)">
                                                    <rect
                                                        x={5048.01}
                                                        y={1783.67}
                                                        width={11.672}
                                                        height={4.57}
                                                        style={{
                                                            fill: "#fff",
                                                            fillRule: "nonzero",
                                                            stroke: "#fff",
                                                            strokeWidth: 1
                                                        }}
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                    <g transform="matrix(5.17324,-4.44089e-16,4.44089e-16,5.29575,-10939.2,-1191.38)">
                                        <g>
                                            <g>
                                                <text
                                                    x="2767.28px"
                                                    y="282.679px"
                                                    style={{
                                                        fontFamily:
                                                            "'GillSans-Light', 'Gill Sans', sans-serif",
                                                        fontWeight: 300,
                                                        fontSize: "9.029px",
                                                        fill: "#808080",
                                                        stroke: "#737373",
                                                        strokeWidth: "0.19px"
                                                    }}>
                                                    {`Label`}
                                                </text>
                                                <text
                                                    x="2759.05px"
                                                    y="291.708px"
                                                    style={{
                                                        fontFamily:
                                                            "'GillSans-Light', 'Gill Sans', sans-serif",
                                                        fontWeight: 300,
                                                        fontSize: "9.029px",
                                                        fill: "#808080",
                                                        stroke: "#737373",
                                                        strokeWidth: "0.19px"
                                                    }}>
                                                    {`Discovery`}
                                                </text>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <g transform="matrix(0.973148,0,0,0.996193,-2325.67,-1250.07)">
                                    <path
                                        d="M5740.45,1709.27l0,494.864"
                                        style={{
                                            fill: "none",
                                            stroke: "#606060",
                                            strokeWidth: "4.5px",
                                            strokeLinecap: "round",
                                            strokeMiterlimit: 1.5
                                        }}
                                    />
                                </g>
                            </g>
                            <g
                                id="ManualAutomated"
                                display={this.displayOn(3, 4)}
                                transform="matrix(0.799185,0,0,0.799185,221.459,66.3167)">
                                <g transform="matrix(5.17324,0,0,5.29575,-10820.3,-1103.98)">
                                    <text
                                        x="2757.55px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Bold', 'Gill Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.24px"
                                        }}>
                                        {`Manual`}
                                    </text>
                                </g>
                                <g transform="matrix(5.17324,0,0,5.29575,-10770.9,-454.771)">
                                    <text
                                        x="2734.47px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Bold', 'Gill Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "10.664px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.24px"
                                        }}>
                                        {`Automated`}
                                    </text>
                                </g>
                                <g transform="matrix(0.973148,0,0,0.996193,-2250.43,-1163.63)">
                                    <path
                                        d="M5923.31,2142.84l19.899,19.899l19.899,-19.899"
                                        style={{
                                            fill: "none",
                                            stroke: "#000",
                                            strokeWidth: "5.63px",
                                            strokeLinecap: "round",
                                            strokeMiterlimit: 1.5
                                        }}
                                    />
                                </g>
                                <g transform="matrix(1.79321e-17,-0.299788,0.973148,6.09992e-17,1620.28,2292.69)">
                                    <path
                                        d="M4342.45,1965.69l1915.36,0"
                                        style={{
                                            fill: "none",
                                            stroke: "#000",
                                            strokeWidth: "7.63px",
                                            strokeLinecap: "round",
                                            strokeMiterlimit: 1.5
                                        }}
                                    />
                                </g>
                            </g>
                            <g
                                id="Metrics"
                                display={this.displayOn(1)}
                                transform="matrix(1,0,0,1,0,-88.5286)">
                                <g transform="matrix(5.17324,2.22045e-16,-2.22045e-16,5.29575,-11544.9,-1167.57)">
                                    <text
                                        x="2767.61px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "9.029px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`High`}
                                    </text>
                                    <text
                                        x="2762.01px"
                                        y="291.708px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "9.029px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`Volume`}
                                    </text>
                                </g>
                                <g transform="matrix(5.17324,-4.44089e-16,4.44089e-16,5.29575,-11756.3,-1169.77)">
                                    <text
                                        x="2768.9px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "9.029px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`User`}
                                    </text>
                                    <text
                                        x="2763.44px"
                                        y="291.708px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "9.029px",
                                            fill: "#808080",
                                            stroke: "#737373",
                                            strokeWidth: "0.19px"
                                        }}>
                                        {`Control`}
                                    </text>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}
