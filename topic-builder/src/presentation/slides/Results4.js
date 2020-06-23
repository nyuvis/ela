import React, { PureComponent } from "react";

export default class Results4 extends PureComponent {
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
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={1.5}
        onClick={this.changePosition}
      >
        <path fill="none" d="M.4.367h1920v1080H.4z" />
        <clipPath id="a">
          <path d="M.4.367h1920v1080H.4z" />
        </clipPath>
        <g clipPath="url(#a)">
          <path fill="#f2f2f2" d="M.4.367h1920v1080H.4z" />
          <g fontSize={10.664} fill="#545454">
            <text
              x={2742.77}
              y={282.679}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              Are speciﬁcations
            </text>
            <text
              x={2742.77}
              y={293.343}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              satisfactory when
            </text>
            <text
              x={2742.77}
              y={304.007}
              fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
              fontWeight={700}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              evaluated
            </text>
            <text
              x={2798.69}
              y={304.007}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              using
            </text>
            <text
              x={2742.77}
              y={314.671}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              traditional
            </text>
            <text
              x={2787.28}
              y={314.671}
              fontFamily="'GillSans-SemiBold','Gill Sans',sans-serif"
              fontWeight={600}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              machine
            </text>
            <text
              x={2742.77}
              y={325.335}
              fontFamily="'GillSans-SemiBold','Gill Sans',sans-serif"
              fontWeight={600}
              transform="translate(-20631.1 -1727.66) scale(7.61716)"
            >
              learning metrics
            </text>
          </g>
          <text
            x={97.881}
            y={508.846}
            fontFamily="'HelveticaNeue-Bold','Helvetica Neue'"
            fontWeight={700}
            fontSize={200.227}
            fill="#018081"
          >
            4
          </text>
          <path
            d="M910.724 173.908v800.25"
            fill="#1f1f1f"
            stroke="#1d1d1d"
            strokeWidth={1.5}
          />
          <use
            xlinkHref="#_Image2"
            x={2576.43}
            y={338.945}
            width={2.095}
            height={458.743}
            transform="scale(.69832 .99944)"
          />
          <use
            xlinkHref="#_Image3"
            x={2567.07}
            y={339.202}
            width={2.095}
            height={459.576}
            transform="scale(.69832 .99908)"
          />
          <path
            display={this.displayOn(0)}
            d="M1823.33 798.36h-438.359V339.509M1810.67 798.324v7.835M1763.87 798.324v7.835M1673.22 798.324v7.835M1583.1 798.324v7.835M1493.04 798.324v7.835M1400.25 798.324v7.835"
            fill="none"
            stroke="#000"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <text
            display={this.displayOn(0)}
            x={1796.79}
            y={836.713}
            fontFamily="'ArialMT','Arial',sans-serif"
            fontSize={20.002}
          >
            0.9
          </text>
          <g fontFamily="'ArialMT','Arial',sans-serif" fontSize={4.774}>
            <text
              x={106.909}
              y={143.74}
              transform="translate(940.242 234.413) scale(4.18993)"
            >
              0.
            </text>
            <text
              x={110.89}
              y={143.74}
              transform="translate(940.242 234.413) scale(4.18993)"
            >
              0
            </text>
          </g>
          <text
            x={1037.57}
            y={450.465}
            fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
            fontWeight={700}
            fontSize={40}
          >
            ELA
          </text>
          <g fontFamily="'GillSans','Gill Sans',sans-serif" fontSize={6}>
            <text
              x={72.45}
              y={38.163}
              transform="translate(823.331 189.328) scale(5.43835)"
            >
              No-cutof
            </text>
            <text
              x={94.821}
              y={38.163}
              transform="translate(823.331 189.328) scale(5.43835)"
            >
              f
            </text>
          </g>
          <text
            x={1248.62}
            y={834.819}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={24.134}
          >
            Precision
          </text>
          <g
            display={this.displayOn(1)}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={5.013}
          >
            <text
              x={76.697}
              y={61.835}
              transform="translate(751.67 103.261) scale(6.38363)"
            >
              Cutof
            </text>
            <text
              x={88.441}
              y={61.835}
              transform="translate(751.67 103.261) scale(6.38363)"
            >
              f
            </text>
          </g>
          <g
            display={this.displayOn(2)}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={7.637}
          >
            <text
              x={72.45}
              y={83.602}
              transform="translate(915.072 234.413) scale(4.18993)"
            >
              No-cutof
            </text>
            <text
              x={100.926}
              y={83.602}
              transform="translate(915.072 234.413) scale(4.18993)"
            >
              f
            </text>
          </g>
          <g
            display={this.displayOn(2)}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={7.637}
          >
            <text
              x={76.697}
              y={104.68}
              transform="translate(919.92 234.413) scale(4.18993)"
            >
              Cutof
            </text>
            <text
              x={94.589}
              y={104.68}
              transform="translate(919.92 234.413) scale(4.18993)"
            >
              f
            </text>
          </g>
          <g
            display={this.displayOn(3)}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={7.637}
          >
            <text
              x={67.126}
              y={125.131}
              transform="translate(914.644 234.413) scale(4.18993)"
            >
              Gr
              <tspan x={75.614} y={125.131}>
                o
              </tspan>
              und
              <tspan x="92.526px 96.184px" y="125.131px 125.131px">
                Tr
              </tspan>
              ut
            </text>
            <text
              x={105.571}
              y={125.131}
              transform="translate(914.644 234.413) scale(4.18993)"
            >
              h
            </text>
          </g>
          <g
            display={this.displayOn(2)}
            fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
            fontWeight={700}
            fontSize={9.547}
          >
            <text
              x={25.407}
              y={105.802}
              transform="translate(925.882 229.61) scale(4.18993)"
            >
              SV
            </text>
            <text
              x={38.455}
              y={105.802}
              transform="translate(925.882 229.61) scale(4.18993)"
            >
              M
            </text>
          </g>
          <text
            x={1064.58}
            y={834.819}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={24.134}
          >
            Recall
          </text>
          <g
            fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
            fontWeight={700}
            fontSize={9}
            fill="#2b2b2b"
          >
            <text
              x={64.421}
              y={14.258}
              transform="translate(727.707 207.457) scale(6.07013)"
            >
              Models' Performanc
            </text>
            <text
              x={156.183}
              y={14.258}
              transform="translate(727.707 207.457) scale(6.07013)"
            >
              e
            </text>
          </g>
          <path
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={5.03}
            strokeLinecap="butt"
            strokeMiterlimit={10}
            d="M1201.14 810.563h26.656v26.656h-26.656z"
          />
          <path
            d="M1751.6 829.651c0-1.693.172-3.055.52-4.087.352-1.032.867-1.828 1.554-2.388.688-.56 1.551-.84 2.594-.84.767 0 1.441.155 2.019.464a3.835 3.835 0 0 1 1.438 1.338c.377.583.674 1.292.888 2.129.214.837.323 1.965.323 3.384 0 1.68-.172 3.036-.516 4.068-.348 1.032-.863 1.83-1.55 2.393-.687.563-1.555.845-2.602.845-1.383 0-2.464-.495-3.251-1.485-.947-1.191-1.417-3.132-1.417-5.821zm1.806 0c0 2.351.277 3.915.826 4.693.548.778 1.227 1.167 2.036 1.167.809 0 1.487-.391 2.036-1.172.549-.781.826-2.344.826-4.688 0-2.357-.277-3.923-.826-4.697-.549-.775-1.236-1.163-2.057-1.163-.804 0-1.45.342-1.932 1.026-.607.872-.909 2.484-.909 4.834z"
            fillRule="nonzero"
          />
          <path d="M1763.71 834.711h2.002v2.002h-2.002z" />
          <path
            d="M1770.99 828.948c-.729-.267-1.269-.648-1.621-1.143-.352-.495-.528-1.087-.528-1.777 0-1.042.373-1.918 1.123-2.627.75-.71 1.743-1.065 2.987-1.065 1.253 0 2.258.363 3.017 1.089.762.726 1.144 1.61 1.144 2.652 0 .664-.172 1.242-.524 1.733-.348.492-.876.871-1.584 1.138.876.286 1.546.749 2.007 1.387.457.638.687 1.4.687 2.285 0 1.224-.431 2.253-1.299 3.087-.867.833-2.007 1.25-3.419 1.25s-2.551-.419-3.419-1.255c-.863-.837-1.298-1.88-1.298-3.131 0-.931.238-1.71.708-2.338.473-.629 1.143-1.057 2.019-1.285zm-.352-2.979c0 .677.218 1.231.654 1.661.436.429 1.001.644 1.701.644.675 0 1.232-.213 1.663-.64.432-.426.65-.949.65-1.567 0-.645-.222-1.187-.671-1.626-.444-.44-1.001-.659-1.663-.659-.67 0-1.228.214-1.672.644-.44.43-.662.944-.662 1.543zm-.565 6.612c0 .501.117.987.356 1.456.234.468.59.831 1.06 1.089.465.257.972.385 1.512.385.838 0 1.534-.27 2.079-.81.548-.541.821-1.228.821-2.061 0-.847-.281-1.546-.842-2.1-.566-.553-1.27-.83-2.116-.83-.826 0-1.513.273-2.058.82-.544.547-.812 1.231-.812 2.051zM1661.08 829.632c0-1.693.176-3.056.524-4.088.348-1.032.863-1.828 1.55-2.387.687-.561 1.555-.841 2.594-.841.771 0 1.441.155 2.023.464.579.31 1.056.756 1.433 1.339.382.582.675 1.292.893 2.128.213.837.318 1.965.318 3.385 0 1.679-.172 3.036-.515 4.068-.344 1.032-.863 1.829-1.55 2.392-.683.564-1.555.845-2.602.845-1.379 0-2.464-.495-3.252-1.484-.942-1.192-1.416-3.132-1.416-5.821zm1.806 0c0 2.35.276 3.914.825 4.692.553.778 1.232 1.168 2.037 1.168.808 0 1.487-.391 2.036-1.172.553-.782.825-2.344.825-4.688 0-2.357-.272-3.923-.825-4.698-.549-.775-1.236-1.162-2.053-1.162-.809 0-1.454.342-1.936 1.025-.603.873-.909 2.484-.909 4.835z"
            fillRule="nonzero"
          />
          <path d="M1673.19 834.691h2.002v2.002h-2.002z" />
          <path
            d="M1686.88 825.881l-1.748.137c-.155-.69-.377-1.191-.662-1.504a2.335 2.335 0 0 0-1.759-.752c-.562 0-1.052.156-1.475.469-.553.403-.989.993-1.307 1.768-.319.774-.486 1.878-.499 3.31.423-.644.939-1.123 1.554-1.435a4.17 4.17 0 0 1 1.924-.469c1.169 0 2.17.431 2.991 1.294.826.863 1.236 1.978 1.236 3.345 0 .899-.192 1.734-.582 2.505-.386.772-.918 1.363-1.597 1.773-.674.41-1.445.615-2.304.615-1.462 0-2.661-.539-3.582-1.616-.926-1.078-1.387-2.854-1.387-5.328 0-2.767.511-4.779 1.533-6.036.893-1.093 2.091-1.641 3.604-1.641 1.127 0 2.049.316 2.769.948.717.632 1.148 1.504 1.291 2.617zm-7.178 6.173c0 .605.13 1.185.386 1.738.26.554.62.975 1.081 1.265.461.29.947.435 1.454.435.741 0 1.382-.3 1.915-.899.532-.599.8-1.413.8-2.442 0-.989-.264-1.769-.792-2.339-.528-.569-1.19-.854-1.99-.854-.796 0-1.471.285-2.024.854-.553.57-.83 1.317-.83 2.242zM1570.57 829.607c0-1.692.172-3.055.52-4.087.348-1.032.867-1.828 1.554-2.388.687-.56 1.55-.84 2.594-.84.767 0 1.441.155 2.019.464.583.309 1.06.755 1.437 1.338.378.583.675 1.292.889 2.129.213.837.322 1.965.322 3.384 0 1.68-.171 3.036-.519 4.068-.344 1.032-.859 1.83-1.546 2.393-.687.563-1.555.845-2.602.845-1.383 0-2.464-.495-3.252-1.485-.947-1.191-1.416-3.132-1.416-5.821zm1.806 0c0 2.351.272 3.915.825 4.693.549.778 1.228 1.167 2.037 1.167.804 0 1.483-.391 2.036-1.172.549-.781.826-2.344.826-4.688 0-2.357-.277-3.923-.826-4.697-.553-.775-1.236-1.163-2.057-1.163-.809 0-1.45.342-1.932 1.026-.607.872-.909 2.484-.909 4.834z"
            fillRule="nonzero"
          />
          <path d="M1582.68 834.667h2.002v2.002h-2.002z" />
          <path
            d="M1592.89 836.669v-3.429h-6.214v-1.611l6.536-9.278h1.433v9.278h1.936v1.611h-1.936v3.429h-1.755zm0-5.04v-6.456l-4.483 6.456h4.483zM1480.07 829.563c0-1.692.175-3.055.523-4.087.348-1.032.868-1.828 1.555-2.388.687-.56 1.55-.84 2.593-.84.767 0 1.442.155 2.02.464a3.87 3.87 0 0 1 1.437 1.338c.377.583.675 1.292.888 2.129.214.837.323 1.965.323 3.384 0 1.68-.172 3.036-.52 4.068-.343 1.032-.859 1.83-1.546 2.393-.687.563-1.554.845-2.602.845-1.382 0-2.468-.495-3.255-1.485-.943-1.191-1.416-3.132-1.416-5.821zm1.81 0c0 2.351.272 3.915.825 4.693.549.778 1.228 1.167 2.036 1.167.805 0 1.484-.391 2.037-1.172.548-.781.825-2.344.825-4.688 0-2.356-.277-3.923-.825-4.697-.553-.775-1.236-1.163-2.058-1.163-.808 0-1.454.342-1.935 1.026-.604.872-.905 2.484-.905 4.834z"
            fillRule="nonzero"
          />
          <path d="M1492.18 834.623h2.002v2.002h-2.002z" />
          <path
            d="M1505.99 834.935v1.69h-9.465c-.013-.424.054-.83.205-1.221.243-.645.628-1.279 1.156-1.905.532-.625 1.299-1.348 2.301-2.168 1.558-1.276 2.61-2.287 3.155-3.033.548-.745.821-1.45.821-2.114 0-.697-.252-1.284-.746-1.763-.499-.478-1.148-.718-1.948-.718-.847 0-1.525.254-2.032.762-.512.508-.767 1.211-.771 2.11l-1.81-.186c.125-1.347.59-2.375 1.399-3.081.804-.707 1.89-1.06 3.251-1.06 1.375 0 2.46.381 3.26 1.143.805.761 1.203 1.706 1.203 2.832 0 .573-.118 1.136-.352 1.69-.235.553-.625 1.136-1.165 1.748-.545.612-1.45 1.452-2.711 2.52-1.056.885-1.735 1.486-2.032 1.802a5.5 5.5 0 0 0-.742.952h7.023z"
            fillRule="nonzero"
          />
          <path
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={5.03}
            strokeLinecap="butt"
            strokeMiterlimit={10}
            d="M1017.11 810.563h26.656v26.656h-26.656z"
          />
          <path
            d="M1610.92 381.086a6.028 6.028 0 0 0-6.021-6.029 6.028 6.028 0 0 0-6.021 6.029 6.028 6.028 0 0 0 6.021 6.029 6.028 6.028 0 0 0 6.021-6.029z"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            d="M1637.34 381.522h-68.359"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            d="M1726.89 415.628c0-3.353-2.732-6.075-6.098-6.075-3.366 0-6.099 2.722-6.099 6.075s2.733 6.075 6.099 6.075 6.098-2.722 6.098-6.075z"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            d="M1765.39 416.064h-93.85"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1531.35 468.457a6.1 6.1 0 0 0-6.096-6.099 6.101 6.101 0 0 0-6.097 6.099 6.1 6.1 0 0 0 6.097 6.098 6.1 6.1 0 0 0 6.096-6.098z"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1552.24 468.895h-52.847"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1775.1 502.998c0-3.347-2.726-6.065-6.083-6.065-3.358 0-6.084 2.718-6.084 6.065 0 3.347 2.726 6.064 6.084 6.064 3.357 0 6.083-2.717 6.083-6.064z"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1814.03 503.434h-103.265"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={3.98}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1749.99 555.825c0-3.313-2.684-6.003-5.991-6.003-3.307 0-5.992 2.69-5.992 6.003s2.685 6.003 5.992 6.003 5.991-2.69 5.991-6.003z"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1768.66 556.263h-51.449"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1768.57 590.367a6.237 6.237 0 0 0-12.473 0 6.237 6.237 0 0 0 12.473 0z"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1784.48 590.803h-50.233"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1775.06 677.732c0-3.341-2.72-6.054-6.069-6.054-3.35 0-6.069 2.713-6.069 6.054s2.719 6.054 6.069 6.054c3.349 0 6.069-2.713 6.069-6.054z"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1791.15 678.175h-50.233"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1748.6 643.194c0-3.353-2.733-6.076-6.1-6.076-3.367 0-6.101 2.723-6.101 6.076 0 3.353 2.734 6.075 6.101 6.075s6.1-2.722 6.1-6.075z"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(2)}
            d="M1768.57 643.63h-60.41"
            fill="#ca0020"
            stroke="#ca0020"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            d="M1822.27 529.411H982.997"
            fill="none"
            stroke="#000"
            strokeOpacity={0.627}
            strokeWidth={1.89}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            d="M1810.67 442.041h-620.036M1810.67 616.78h-620.036M1810.67 707.156h-620.036"
            fill="none"
            stroke="#000"
            strokeOpacity={0.361}
            strokeWidth={2.51}
            strokeLinecap="butt"
            strokeMiterlimit={10}
            strokeDasharray="2.51,5.03"
          />
          <path
            d="M1384.82 798.324H980.44"
            fill="none"
            stroke="#000"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(3)}
            d="M1806.18 768.206c0-3.341-2.719-6.054-6.069-6.054-3.349 0-6.069 2.713-6.069 6.054s2.72 6.054 6.069 6.054c3.35 0 6.069-2.713 6.069-6.054z"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={2.51}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(3)}
            d="M1820.77 768.648h-43.085"
            fill="#0571b0"
            stroke="#0571b0"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(3)}
            d="M1799.8 728.598a6.071 6.071 0 0 0-6.069-6.069 6.072 6.072 0 0 0-6.069 6.069 6.073 6.073 0 0 0 6.069 6.069c3.35 0 6.069-2.72 6.069-6.069z"
            fill="#ca0020"
          />
          <path
            display={this.displayOn(3)}
            d="M1808.65 729.056h-30.628"
            fill="#0571b0"
            stroke="#ca0020"
            strokeWidth={3.77}
            strokeLinecap="butt"
            strokeMiterlimit={10}
          />
        </g>
        <defs>
          <image
            display={this.displayOn(4)}
            id="_Image2"
            width={3}
            height={459}
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAHLCAYAAAAN5CLSAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADBUlEQVRYhcXYW28WVRgF4Gc2s5uSFiqpp0JiW0G0ooS0GKUe4lnUXzP/bG7UqJBoEwFNUSoCarTABaERgjQBOaXUi3k/U+OHN8zXWTezZrIuZq28e/aaXeSqfh+HcDxhUoPJZAM28+ZW8FsljuBPnDQ4FLmqt+N5nC3xIZ7DUwnbQzXWWSBXgl8p8QnO4EIfI22hyFW9G6/imxKvawYjJeRQ5S4CWU84jTX81LxHVW95kJOHRK7qIZpAXsM7OJowE4KZzobibvC7Jb6OB8f6umgHRa7qYTyN5RIf4UWcThgP1XhngVwPfr3EZ1jGz/2ctIQiV/UuvITvSrytSWdbwnCohjsLZDn47yBX9bZ+LlpEkat6Fu/hy4RZTQ6zCUVPtZkZrAVfS5rVsWLwqyRhFy71VskcTiZMhGqis6G4EfxGic81gSz1c9ISilzV4ziAUyU+wDN4ImEkVCOdBXI5+OUSn+KHDQ8HgSJX9QzexFdJU70ex6GE3k62ZTMzuB/8fsL3+CuuA0Wu6jGaQN4VbSNhOgTTnQ3F7eC3SxzFKhb7umgHRa7qUU2vONf7bMxgKmEsVI90FsjV4Fd7q+Qczvdz0hKKXNXTmMexEm9gCmXCUKiGOgvkLNbjSq7qbDDIVV3SBDKvqaBHEvbFm7zQWQb3gt9LWNA0jYUHGWkBRfTxaZwv8TH2Yynh0VA91lkgq8FXexX0gmalDApFruoJHMRiqZmO3eJndWuotnYWyIXgzTVX9Y7/emgVRa7qAzb8qM1hFHNpw/ulTipoiROaRnzi/208FIpc1QWexEpvLzmIxYSdodrZ2VDcDH6zxBf4A6f6OWkJRQzefvxY4jD2igxGQzXaWSArwVd6m+sSLvVz0hKKXNXPavbUhaTZZXdiPqEMVbmZGawHX0+aYbijqeLEOA8CuapHaAJ5y4ZA9oRgT2dDcSf4PxX0ZXzb10U7KCKMvfi1dwq6D2cSeh/uHZ0Fci34td4p6C/4rZ+TllDkqp7EKzheav7YpsSRzr8q6MW4ufg3Y1Wpnr9B7cwAAAAASUVORK5CYII="
          />
          <image
            display={this.displayOn(4)}
            id="_Image3"
            width={3}
            height={460}
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAHMCAYAAAAQ4RJqAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC+0lEQVRYhcXY3W9VRRQF8N8ZT2mDtQ22aZw6FtMStZgaJQqKoBE/8OPvVROFCGoErR+A4IgJaMWHGgxWDUEQig8zV9vk0pfe9qyXWTdZD3et7Nmzz25yTG/gBZwK2K1gd7AG2/njRuU3WhzD7/jK1qHJMY1hL75r8SbmMRMwXlXjnQVytfKrLd7DBfzUx8ig0OSYZnEIn7Z4SSmMEDBUVUOdBXIeq/Ukx3TfPYxsFjmmIUogL+JVHA9KqTTY21kGtyq/1eIk/sFn9zIyADQ5pmHM4nKLd7CAcwETVTXZWSB/VL7SuyWX8X0/JwNCk2OaxnNYbJXqmMVYwEhVjXQWyI+VlzPHNG5r0eSYnsFrOBawDzuxL6z5f2E7M7hT+Z0WpzGMUxvb2BSaHFPAQ1hu8RaexZcB01U13VlRXK/8eosP8CvO9nMyIDQ5pgfxFM61OIrHEANGq2q0s0CWK1/utY2z+KWfkwGhyTE9jpdxMuAgIg4GtFXVbmcGdyu/G3AGN/ENyDE1G5jZDHJMo5RAjuAwPg6Yq4I9nRXFzcr/bnEcB/B5XxeDQZNjul+5GD/02saTuBCwq6p2dRbItcqv9W7JRVzq52RAaHJMM+p3SYtX8CiGA3ZU1XBngVysvJw5phFbg/qeaHJMB6x5XBeUbrEQlFkUmu3M4HbltwM+wc/13Co0OaZW+RRZ6o2gT+NMwFRVTXVWFH9V/meL93FF7yNla9DkmKaUQevrFq9jDyaCMnrBzs4C6b2jV5r6jkzit75WBoMmx7SgdIuPAvYr7XN/ZyPoauWrLRaVmWdxYxubR45pkhLIUTyP0wEzVTDTWVGs2+98qDwuW73fGVff095+5wk8EjBWVWOdBbJuv/Ou0jKW+jkZEJoc05w1+53DSlNtgo72O+tG0PPKl9t27Hd2UAI5ZM1+Z74K5jsriv/2OwEnlEnjRB8Pg0JTh5g5XGrxtjJkfBv8v9+Z6CyQlcpXeo/rdux3Hlb2O1+0OKLsdx4INtrv9G7u0r80SqanxCeTJwAAAABJRU5ErkJggg=="
          />
        </defs>
      </svg>
    );
  }
}
