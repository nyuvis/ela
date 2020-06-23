import React, { PureComponent } from "react";
import ElaImage from "./ElaImage.png";
export default class ELAIntro extends PureComponent {
  render() {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1921 1081"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={1.414}
      >
        <g clipPath="url(#a)">
          <use
            xlinkHref="#_Image2"
            x={562.779}
            y={148.305}
            width={1217.24}
            height={757.801}
            transform="scale(.99937 .99974)"
          />
          <g clipPath="url(#b)">
            <g clipPath="url(#c)">
              <use
                xlinkHref="#_Image5"
                x={640.917}
                y={226.351}
                width={1063.21}
                height={601.789}
                transform="scale(.99925 .99965)"
              />
            </g>
            <path
              fill="none"
              stroke="#fff"
              d="M640.439 226.272h1063.21v601.789H640.439z"
            />
          </g>

          <text
            x={301.289}
            y={586.738}
            fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
            fontWeight={700}
            fontSize={136.59}
            fill="#018081"
          >
            E
            <tspan x="386.562px 469.968px" y="586.738px 586.738px">
              LA
            </tspan>
          </text>
        </g>
        <defs>
          <image id="_Image2" width={1218} height={758} xlinkHref={ElaImage} />
        </defs>
      </svg>
    );
  }
}
