import React, { PureComponent } from "react";

export default class Title extends PureComponent {
  render() {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1921 1080"
        version="1.1"
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: "1.5"
        }}
      >
        <rect
          id="_1---Title"
          x="0.4"
          y="0"
          width="1920"
          height="1080"
          style={{ fill: "none" }}
        />
        <clipPath id="_clip1">
          <rect x="0.4" y="0" width="1920" height="1080" />
        </clipPath>
        <g clipPath="url(#_clip1)">
          <rect
            x="0.4"
            y="0"
            width="1920"
            height="1080"
            style={{ fill: "#f2f2f2" }}
          />
          <g transform="matrix(4.12597,0,0,4.12597,-10509.6,-185.19)">
            <text
              x="2682.34px"
              y="282.679px"
              style={{
                fontFamily: "'GillSans', 'Gill Sans', sans-serif",
                fontSize: "10.664px",
                fill: "#018081"
              }}
            >
              Cristian F
              <tspan x="2724.13px " y="282.679px ">
                e
              </tspan>
              lix
            </text>
            <text
              x="2739.25px"
              y="282.679px"
              style={{
                fontFamily: "'GillSans-Light', 'Gill Sans', sans-serif",
                fontWeight: "300",
                fontSize: "10.664px",
                fill: "#018081"
              }}
            >
              ,
            </text>
            <text
              x="2744.1px"
              y="282.679px"
              style={{
                fontFamily: "'GillSans-Light', 'Gill Sans', sans-serif",
                fontWeight: "300",
                fontSize: "10.664px",
                fill: "#414141"
              }}
            >
              Aritra Dasgupta, Enrico Bertini
            </text>
          </g>
          <g>
            <rect
              x="143.996"
              y="417.384"
              width="20.344"
              height="183.218"
              style={{ fill: "#018081" }}
            />
            <path
              d="M179.569,417.384l0,183.218"
              style={{ fill: "none", stroke: "#666", strokeWidth: "3px" }}
            />
            <text
              x="207.434px"
              y="490.299px"
              style={{
                fontFamily: "'GillSans-SemiBold', 'Gill Sans', sans-serif",
                fontWeight: "600",
                fontSize: "61.606px",
                fill: "#018081"
              }}
            >
              THE EXPL
              <tspan
                x="499.072px 551.383px 591.061px 630.918px 669.482px 721.794px 757.771px 798.26px "
                y="490.299px 490.299px 490.299px 490.299px 490.299px 490.299px 490.299px 490.299px "
              >
                ORATORY{" "}
              </tspan>
              LABELING{" "}
              <tspan x="1129.58px 1174.37px " y="490.299px 490.299px ">
                AS
              </tspan>
              SIS
              <tspan
                x="1289.61px 1325.7px 1370.5px "
                y="490.299px 490.299px 490.299px "
              >
                TAN
              </tspan>
              T:
            </text>
            <text
              x="204.216px"
              y="567.482px"
              style={{
                fontFamily: "'GillSans-Light', 'Gill Sans', sans-serif",
                fontWeight: "300",
                fontSize: "61.606px",
                fill: "#616161"
              }}
            >
              Mixed-Initiative Label Curation with Large Document Collections
            </text>
          </g>
          <use
            href="#_Image2"
            x="1285.14"
            y="42.628"
            width="593.02px"
            height="57.91px"
            transform="matrix(0.998351,0,0,0.998445,0,0)"
          />
        </g>
        <defs>
          <image
            id="_Image2"
            width="594px"
            height="58px"
            href="data:image/png;base64,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"
          />
        </defs>
      </svg>
    );
  }
}
