import React, { PureComponent } from "react";

export default class Problem extends PureComponent {
    constructor() {
        super();
        this.state = {
            position: 0,
            steps: 10
        };
    }
    displayOn(position) {
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
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 1.5
                }}
                onClick={this.changePosition}>
                <g transform="matrix(1,0,0,1,-2188,-2906)">
                    <g
                        id="Artboard1"
                        transform="matrix(1.02759,0,0,1.00382,183.648,2902.41)">
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
                            <g>
                                <g transform="matrix(1,0,0,1,-14.2621,4.54747e-13)">
                                    <g transform="matrix(1,0,0,1,37.5118,4.54747e-13)">
                                        <g transform="matrix(1.47686,0,0,1.51183,-859.546,-2412.05)">
                                            <circle
                                                cx={2380.28}
                                                cy={1715.02}
                                                r={30.479}
                                                style={{ fill: "#018081" }}
                                            />
                                        </g>
                                        <g transform="matrix(6.08689,0,0,6.23103,-14021.2,-1581.2)">
                                            <text
                                                x="2748.98px"
                                                y="282.679px"
                                                style={{
                                                    fontFamily:
                                                        "'GillSans-Bold', 'Gill Sans', sans-serif",
                                                    fontWeight: 700,
                                                    fontSize: "10.664px",
                                                    fill: "#018081"
                                                }}>
                                                {`Documents`}
                                            </text>
                                        </g>
                                    </g>
                                    <g transform="matrix(2.89063,0,0,2.95909,2654.28,139.34)">
                                        <path
                                            d="M15,5l6,6l0,10c0,1.1 -0.9,2 -2,2l-11.01,0c-1.1,0 -1.99,-0.9 -1.99,-2l0.01,-14c0,-1.1 0.89,-2 1.99,-2l7,0Zm-1,7l5.5,0l-5.5,-5.5l0,5.5Z"
                                            style={{
                                                fill: "#fff",
                                                fillRule: "nonzero"
                                            }}
                                        />
                                    </g>
                                </g>
                                <g
                                    display={this.displayOn(2)}
                                    transform="matrix(6.08689,0,0,6.23103,-14061.9,-1519.22)">
                                    <text
                                        x="2762.21px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Light', 'Gill Sans', sans-serif",
                                            fontWeight: 300,
                                            fontSize: "10.664px",
                                            fill: "#808080"
                                        }}>
                                        {`High Volume`}
                                    </text>
                                </g>
                            </g>
                            <g>
                                <g transform="matrix(2.26581,0,0,2.769,-2732.44,-3925.09)">
                                    <rect
                                        x={2455.78}
                                        y={1672.7}
                                        width={53.949}
                                        height={16.84}
                                        style={{ fill: "#014f81" }}
                                    />
                                </g>
                                <g transform="matrix(0.99902,0,0,1.22088,359.191,-1575.85)">
                                    <path
                                        d="M2536.29,1617.83l0,247.876"
                                        style={{
                                            fill: "none",
                                            stroke: "#000",
                                            strokeWidth: "2.65px"
                                        }}
                                    />
                                </g>
                            </g>
                            <g>
                                <g transform="matrix(2.26581,0,0,2.769,-2542.77,-3925.09)">
                                    <rect
                                        x={2455.78}
                                        y={1672.7}
                                        width={53.949}
                                        height={16.84}
                                        style={{ fill: "#018138" }}
                                    />
                                </g>
                                <g transform="matrix(-0.99902,0,0,1.22088,5426.81,-1575.85)">
                                    <path
                                        d="M2536.29,1515.44l0,109.902c-1.589,80.392 -189.189,177.84 -189.69,244.172"
                                        style={{
                                            fill: "none",
                                            stroke: "#000",
                                            strokeWidth: "2.65px"
                                        }}
                                    />
                                </g>
                            </g>
                            <g>
                                <g transform="matrix(2.26581,0,0,2.769,-2922.29,-3925.09)">
                                    <rect
                                        x={2455.78}
                                        y={1672.7}
                                        width={53.949}
                                        height={16.84}
                                        style={{ fill: "#018081" }}
                                    />
                                </g>
                                <g transform="matrix(0.99902,0,0,1.22088,359.191,-1575.85)">
                                    <path
                                        d="M2536.29,1515.44l0,109.902c-1.589,80.392 -189.189,177.84 -189.69,244.172"
                                        style={{
                                            fill: "none",
                                            stroke: "#000",
                                            strokeWidth: "2.65px"
                                        }}
                                    />
                                </g>
                            </g>
                            <g display={this.displayOn(1)}>
                                <g transform="matrix(6.08689,0,0,6.23103,-14046.4,-844.759)">
                                    <text
                                        x="2762.21px"
                                        y="282.679px"
                                        style={{
                                            fontFamily:
                                                "'GillSans-Bold', 'Gill Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "10.664px",
                                            fill: "#018081"
                                        }}>
                                        {`Unknown`}
                                    </text>
                                </g>
                                <g transform="matrix(4.50128,0,0,4.60788,2640.13,865.743)">
                                    <path
                                        d="M12,2c-5.52,0 -10,4.48 -10,10c0,5.52 4.48,10 10,10c5.52,0 10,-4.48 10,-10c0,-5.52 -4.48,-10 -10,-10Zm1,17l-2,0l0,-2l2,0l0,2Zm2.07,-7.75l-0.9,0.92c-0.72,0.73 -1.17,1.33 -1.17,2.83l-2,0l0,-0.5c0,-1.1 0.45,-2.1 1.17,-2.83l1.24,-1.26c0.37,-0.36 0.59,-0.86 0.59,-1.41c0,-1.1 -0.9,-2 -2,-2c-1.1,0 -2,0.9 -2,2l-2,0c0,-2.21 1.79,-4 4,-4c2.21,0 4,1.79 4,4c0,0.88 -0.36,1.68 -0.93,2.25Z"
                                        style={{
                                            fill: "#018081",
                                            fillRule: "nonzero"
                                        }}
                                    />
                                </g>
                            </g>
                            <g transform="matrix(6.08689,0,0,6.23103,-14032,-784.558)">
                                <text
                                    x="2762.21px"
                                    y="282.679px"
                                    style={{
                                        fontFamily:
                                            "'GillSans-Light', 'Gill Sans', sans-serif",
                                        fontWeight: 300,
                                        fontSize: "10.664px",
                                        fill: "#808080"
                                    }}>
                                    {`Categories`}
                                </text>
                            </g>
                            <g transform="matrix(1.14502,0,0,1.17213,-51.2872,-1541.02)">
                                <path
                                    d="M2395.04,1906.71l10.852,10.852l10.243,-10.243"
                                    style={{
                                        fill: "none",
                                        stroke: "#000",
                                        strokeWidth: "2.55px"
                                    }}
                                />
                            </g>
                            <g transform="matrix(1.14502,0,0,1.17213,138.566,-1541.02)">
                                <path
                                    d="M2395.04,1906.71l10.852,10.852l10.243,-10.243"
                                    style={{
                                        fill: "none",
                                        stroke: "#000",
                                        strokeWidth: "2.55px"
                                    }}
                                />
                            </g>
                            <g transform="matrix(1.14502,0,0,1.17213,328.238,-1541.02)">
                                <path
                                    d="M2395.04,1906.71l10.852,10.852l10.243,-10.243"
                                    style={{
                                        fill: "none",
                                        stroke: "#000",
                                        strokeWidth: "2.55px"
                                    }}
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}
