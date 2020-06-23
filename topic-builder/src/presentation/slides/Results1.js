import React, { PureComponent } from "react";

export default class Results1 extends PureComponent {
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
        <path fill="none" d="M.4.35h1920v1080H.4z" />
        <clipPath id="a">
          <path d="M.4.35h1920v1080H.4z" />
        </clipPath>
        <g clipPath="url(#a)">
          <path fill="#f2f2f2" d="M.4.35h1920v1080H.4z" />
          <path fill="none" d="M.4.35h137.158v137.158H.4z" />
          <g fontSize={10.664} fill="#545454">
            <text
              x={2742.77}
              y={282.679}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20690.8 -1727.68) scale(7.61716)"
            >
              Can users
            </text>
            <text
              x={2742.77}
              y={293.343}
              fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
              fontWeight={700}
              transform="translate(-20690.8 -1727.68) scale(7.61716)"
            >
              understand
            </text>
            <text
              x={2742.77}
              y={304.007}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20690.8 -1727.68) scale(7.61716)"
            >
              and
            </text>
            <text
              x={2760.95}
              y={304.007}
              fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
              fontWeight={700}
              transform="translate(-20690.8 -1727.68) scale(7.61716)"
            >
              use
            </text>
            <text
              x={2782.21}
              y={304.007}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20690.8 -1727.68) scale(7.61716)"
            >
              the tool
            </text>
            <text
              x={2742.77}
              y={314.671}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(-20690.8 -1727.68) scale(7.61716)"
            >
              satisfactorily?
            </text>
          </g>
          <text
            x={75.055}
            y={508.829}
            fontFamily="'HelveticaNeue-Bold','Helvetica Neue'"
            fontWeight={700}
            fontSize={200.227}
            fill="#018081"
          >
            1
          </text>
          <path
            d="M797.599 173.89v800.25"
            fill="#1f1f1f"
            stroke="#1d1d1d"
            strokeWidth={1.5}
          />
          <path
            display={this.displayOn(2)}
            fill="#013a81"
            d="M1684.62 737.915h50.285v20.598h-50.285z"
          />
          <path
            display={this.displayOn(2)}
            fill="#d3bc31"
            d="M1276.12 737.915h101.504v20.598H1276.12z"
          />
          <path
            display={this.displayOn(2)}
            fill="#013a81"
            fillOpacity={0.361}
            d="M1377.62 737.915h307.005v20.598H1377.62z"
          />
          <path
            display={this.displayOn(2)}
            fill="#013a81"
            d="M1684.62 797.456h50.285v19.038h-50.285z"
          />
          <path
            display={this.displayOn(2)}
            fill="#d3bc31"
            d="M1326.5 797.456h101.504v19.038H1326.5z"
          />
          <path
            display={this.displayOn(2)}
            fill="#810115"
            fillOpacity={0.62}
            d="M1275.75 797.456h50.752v19.038h-50.752z"
          />
          <path
            display={this.displayOn(2)}
            fill="#013a81"
            fillOpacity={0.361}
            d="M1428.97 797.456h255.654v19.038H1428.97z"
          />
          <path
            display={this.displayOn(2)}
            fill="#013a81"
            d="M1633.42 857.955h101.481v18.861H1633.42z"
          />
          <path
            display={this.displayOn(2)}
            fill="#d3bc31"
            d="M1275.75 857.955h101.504v18.861H1275.75z"
          />
          <path
            display={this.displayOn(2)}
            fill="#013a81"
            fillOpacity={0.361}
            d="M1377.62 857.955h255.808v18.861H1377.62z"
          />
          <g
            display={this.displayOn(2)}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={7}
            fill="#585858"
          >
            <text
              x={52.715}
              y={35.108}
              transform="translate(670.547 573.013) scale(5.37332)"
            >
              Result Satisfactio
            </text>
            <text
              x={100.584}
              y={35.108}
              transform="translate(670.547 573.013) scale(5.37332)"
            >
              n
            </text>
          </g>
          <g display={this.displayOn(1)} fontSize={8} fill="#585858">
            <text
              x={6.361}
              y={135.308}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(803.932 -654.183) scale(6.86278)"
            >
              Usability
            </text>
            <text
              x={34.755}
              y={135.308}
              fontFamily="'GillSans-Light','Gill Sans',sans-serif"
              fontWeight={300}
              transform="translate(803.932 -654.183) scale(6.86278)"
            >
              -
            </text>
            <text
              x={39.482}
              y={135.308}
              fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
              fontWeight={700}
              transform="translate(803.932 -654.183) scale(6.86278)"
            >
              SUS Scor
            </text>
            <text
              x={76.619}
              y={135.308}
              fontFamily="'GillSans-Bold','Gill Sans',sans-serif"
              fontWeight={700}
              transform="translate(803.932 -654.183) scale(6.86278)"
            >
              e
            </text>
          </g>
          <g
            display={this.displayOn(2)}
            fontFamily="'GillSans-Light','Gill Sans',sans-serif"
            fontWeight={300}
            fontSize={8}
            fill="#585858"
          >
            <text
              x={8.585}
              y={12.189}
              transform="translate(789.566 563.241) scale(6.76418)"
            >
              User perception of the task outcom
            </text>
            <text
              x={121.62}
              y={12.189}
              transform="translate(789.566 563.241) scale(6.76418)"
            >
              e
            </text>
          </g>
          <text
            display={this.displayOn(2)}
            x={900.756}
            y={816.792}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={37.613}
            fill="#585858"
          >
            Coverage Conﬁdence
          </text>
          <text
            display={this.displayOn(2)}
            x={845.013}
            y={877.429}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={37.613}
            fill="#585858"
          >
            Speciﬁcation Conﬁdence
          </text>
          <text
            display={this.displayOn(1)}
            x={1185.52}
            y={347.07}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={28.517}
            fill="#4f4f4f"
            transform="rotate(.081 778.913 -376.606)"
          >
            Poor
          </text>
          <text
            display={this.displayOn(1)}
            x={868.397}
            y={452.754}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={28.517}
            fill="#4f4f4f"
            transform="rotate(.081 778.913 -376.606)"
          >
            0
          </text>
          <text
            display={this.displayOn(1)}
            x={1711.43}
            y={452.754}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={28.517}
            fill="#4f4f4f"
            transform="rotate(.081 778.913 -376.606)"
          >
            100
          </text>
          <text
            display={this.displayOn(1)}
            x={1292.18}
            y={347.07}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={28.517}
            fill="#4f4f4f"
            transform="rotate(.081 778.913 -376.606)"
          >
            Ok
          </text>
          <g
            display={this.displayOn(1)}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={5.771}
            fill="#4f4f4f"
          >
            <text
              x={138.33}
              y={146.408}
              transform="matrix(4.94123 .00562 -.00562 4.94123 779.029 -376.363)"
            >
              Goo
            </text>
            <text
              x={148.971}
              y={146.408}
              transform="matrix(4.94123 .00562 -.00562 4.94123 779.029 -376.363)"
            >
              d
            </text>
          </g>
          <text
            display={this.displayOn(1)}
            x={1550.24}
            y={347.07}
            fontFamily="'GillSans','Gill Sans',sans-serif"
            fontSize={28.517}
            fill="#4f4f4f"
            transform="rotate(.081 778.913 -376.606)"
          >
            Excellent
          </text>
          <path
            display={this.displayOn(2)}
            d="M1275.75 706.438v207.015"
            fill="none"
            stroke="#000"
            strokeWidth={0.24}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1734.91 364.738l-859.423-.358-.047 15.278 859.423.359.047-15.279z"
            fill="#dcdcdc"
            stroke="#fff"
            strokeWidth={0.24}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1607.14 364.685l-731.658-.305-.047 15.278 731.657.305.048-15.278z"
            fill="#018081"
            fillOpacity={0.494}
          />
          <path
            display={this.displayOn(1)}
            d="M1216.16 352.098l-.06 52.966"
            fill="none"
            stroke="#000"
            strokeWidth={0.24}
            strokeMiterlimit={10}
            strokeDasharray=".96,1.2,0,.24"
          />
          <path
            display={this.displayOn(1)}
            d="M875.483 364.38l-.068 60.1"
            fill="none"
            stroke="#000"
            strokeWidth={0.24}
            strokeMiterlimit={10}
          />
          <path
            display={this.displayOn(1)}
            d="M1312.28 353.534l-.06 52.965M1498.54 353.746l-.06 52.965M1605.8 353.868l-.06 52.965"
            fill="none"
            stroke="#000"
            strokeWidth={0.24}
            strokeMiterlimit={10}
            strokeDasharray=".96,1.2,0,.24"
          />
          <path
            display={this.displayOn(1)}
            d="M1735.01 365.357l-.068 60.1"
            fill="none"
            stroke="#000"
            strokeWidth={0.24}
            strokeMiterlimit={10}
          />
        </g>
      </svg>
    );
  }
}
