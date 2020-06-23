import React, { PureComponent } from "react";

export default class Results3 extends PureComponent {
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
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={1.5}
        onClick={this.changePosition}
      >
        <path fill="none" d="M.4.462h1920v1080H.4z" />
        <clipPath id="a">
          <path d="M.4.462h1920v1080H.4z" />
        </clipPath>
        <g clipPath="url(#a)">
          <path fill="#f2f2f2" d="M.4.462h1920v1080H.4z" />
          <g fontSize={10.664} fill="#545454">
            <text
              x={2742.77}
              y={282.679}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20631.1 -1727.56) scale(7.61716)"
            >
              Do users create
            </text>
            <text
              x={2742.77}
              y={293.343}
              fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
              fontWeight={700}
              transform="translate(-20631.1 -1727.56) scale(7.61716)"
            >
              speciﬁcations
            </text>
            <text
              x={2742.77}
              y={304.007}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20631.1 -1727.56) scale(7.61716)"
            >
              that are easy to
            </text>
            <text
              x={2742.77}
              y={314.671}
              fontFamily="'GillSans-SemiBold','Gill Sans',sans-serif"
              fontWeight={600}
              transform="translate(-20631.1 -1727.56) scale(7.61716)"
            >
              understand
            </text>
          </g>
          <text
            x={97.881}
            y={508.941}
            fontFamily="'HelveticaNeue-Bold','Helvetica Neue'"
            fontWeight={700}
            fontSize={200.227}
            fill="#018081"
          >
            3
          </text>
          <path
            d="M910.724 174.002v800.25"
            fill="#1f1f1f"
            stroke="#1d1d1d"
            strokeWidth={1.5}
          />
          <g
            fill="none"
            stroke="#d8d8d8"
            strokeWidth={2}
            strokeLinecap="butt"
            strokeMiterlimit={10}
            strokeDasharray="2,4"
          >
            <path d="M1070.44 562.59h644.223M1070.44 514.025h644.223M1070.44 465.259h644.223M1070.44 417.805h644.223M1070.44 368.7h644.223M1070.44 611.328h644.223M1070.44 659.472h644.223M1070.44 708.288h644.223M1070.44 756.992h644.223M1070.44 805.506h644.223" />
          </g>
          <g
            fill="none"
            stroke="#020000"
            strokeWidth={2}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          >
            <path d="M1070.44 562.59h-7.239M1070.44 514.025h-7.239M1070.44 465.259h-7.239M1070.44 417.805h-7.239M1070.44 368.7h-7.239M1070.44 611.328h-7.239M1070.44 659.472h-7.239M1070.44 708.288h-7.239M1070.44 756.992h-7.239M1070.44 805.506h-7.239" />
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.475}
              y={98.098}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.189}
              y={98.098}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              5
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.433}
              y={90.677}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.147}
              y={90.677}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              6
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.471}
              y={83.256}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.185}
              y={83.256}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              9
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.538}
              y={69.239}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.252}
              y={69.239}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              2
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.45}
              y={61.819}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.164}
              y={61.819}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              4
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.475}
              y={54.398}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.189}
              y={54.398}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              7
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.471}
              y={46.977}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.185}
              y={46.977}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              3
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={8.446}
              y={39.556}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.16}
              y={39.556}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              8
            </text>
          </g>
          <g fontFamily="'HelveticaNeue','Helvetica Neue'" fontSize={4.188}>
            <text
              x={9.116}
              y={32.135}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              P
            </text>
            <text
              x={11.83}
              y={32.135}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              1
            </text>
          </g>
          <g
            display={this.displayOn(1)}
            fontFamily="'HelveticaNeue-Bold','Helvetica Neue'"
            fontWeight={700}
            fontSize={4.188}
            fill="#d7191c"
          >
            <text
              x={4.836}
              y={76.66}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              LD
            </text>
            <text
              x={10.423}
              y={76.66}
              transform="translate(962.246 164.229) scale(6.60575)"
            >
              A
            </text>
          </g>
          <g
            fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
            fontWeight={700}
            fontSize={9}
            fill="#525252"
          >
            <text
              x={62.553}
              y={18.433}
              transform="translate(712.791 210.985) scale(5.09086)"
            >
              Inter-rater Agreement Score
            </text>
            <text
              x={196.683}
              y={18.433}
              transform="translate(712.791 210.985) scale(5.09086)"
            >
              s
            </text>
          </g>
          <text
            x={12.828}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 968.26 164.229)"
          >
            0.
          </text>
          <text
            x={16.547}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 970.004 164.229)"
          >
            0
          </text>
          <text
            x={32.582}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 977.522 164.229)"
          >
            0.
          </text>
          <text
            x={36.301}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 979.265 164.229)"
          >
            2
          </text>
          <text
            x={52.083}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 986.665 164.229)"
          >
            0.
          </text>
          <text
            x={55.802}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 988.408 164.229)"
          >
            4
          </text>
          <text
            x={71.727}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 995.874 164.229)"
          >
            0.
          </text>
          <text
            x={75.446}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 997.618 164.229)"
          >
            6
          </text>
          <text
            x={91.414}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 1005.105 164.229)"
          >
            0.
          </text>
          <text
            x={95.133}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 1006.848 164.229)"
          >
            8
          </text>
          <text
            x={110.773}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 1014.18 164.229)"
          >
            1.
          </text>
          <text
            x={114.492}
            y={106.044}
            fontFamily="'HelveticaNeue','Helvetica Neue'"
            fontSize={4.8}
            transform="matrix(6.1369 0 0 6.60575 1015.924 164.229)"
          >
            0
          </text>
          <path
            display={this.displayOn(1)}
            d="M1538.19 828.927v-480.16"
            fill="none"
            stroke="#d7191c"
            strokeWidth={3}
            strokeMiterlimit={10}
            strokeDasharray="12,12"
          />
          <path
            d="M1329.49 814.545c5.04 0 9.131-4.092 9.131-9.13 0-5.04-4.091-9.132-9.131-9.132-5.039 0-9.13 4.092-9.13 9.132 0 5.038 4.091 9.13 9.13 9.13zM1382.91 766.34c5.039 0 9.13-4.092 9.13-9.131 0-5.039-4.091-9.131-9.13-9.131-5.04 0-9.132 4.092-9.132 9.131 0 5.039 4.092 9.131 9.132 9.131zM1530.43 717.198c5.039 0 9.131-4.091 9.131-9.13 0-5.04-4.092-9.131-9.131-9.131-5.039 0-9.131 4.091-9.131 9.131 0 5.039 4.092 9.13 9.131 9.13z"
            fill="#018081"
          />
          <path
            display={this.displayOn(1)}
            d="M1538.06 668.261c5.04 0 9.131-4.092 9.131-9.131 0-5.039-4.091-9.131-9.131-9.131-5.039 0-9.13 4.092-9.13 9.131 0 5.039 4.091 9.131 9.13 9.131z"
            fill="#d7191c"
          />
          <path
            d="M1564.83 620.509c5.039 0 9.131-4.092 9.131-9.131 0-5.039-4.092-9.131-9.131-9.131-5.039 0-9.131 4.092-9.131 9.131 0 5.039 4.092 9.131 9.131 9.131zM1570.12 571.825c5.039 0 9.13-4.091 9.13-9.13 0-5.04-4.091-9.131-9.13-9.131-5.04 0-9.131 4.091-9.131 9.131 0 5.039 4.091 9.13 9.131 9.13zM1611.58 523.592c5.04 0 9.131-4.091 9.131-9.131 0-5.039-4.091-9.13-9.131-9.13-5.039 0-9.13 4.091-9.13 9.13 0 5.04 4.091 9.131 9.13 9.131zM1612.47 474.691c5.039 0 9.13-4.092 9.13-9.131 0-5.04-4.091-9.131-9.13-9.131-5.04 0-9.131 4.091-9.131 9.131 0 5.039 4.091 9.131 9.131 9.131zM1630.83 426.717c5.041 0 9.136-4.09 9.136-9.13 0-5.04-4.095-9.131-9.136-9.131-5.033 0-9.127 4.091-9.127 9.131s4.094 9.13 9.127 9.13zM1672.15 378.049c5.041 0 9.136-4.091 9.136-9.131 0-5.039-4.095-9.131-9.136-9.131-5.033 0-9.129 4.092-9.129 9.131 0 5.04 4.096 9.131 9.129 9.131z"
            fill="#018081"
          />
          <g
            fill="none"
            stroke="#000"
            strokeWidth={2}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          >
            <path d="M1069.63 345.133v494.972M1716.39 830.765h-646.532" />
          </g>
          <g
            fill="none"
            stroke="#000"
            strokeWidth={0.6}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          >
            <path d="M1715.22 837.691v-8.041M1586.06 837.691v-8.041M1456.46 837.691v-8.041M1326.85 837.691v-8.041M1197.35 837.691v-8.041" />
          </g>
        </g>
      </svg>
    );
  }
}
