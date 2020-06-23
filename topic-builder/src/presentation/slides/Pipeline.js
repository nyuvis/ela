import React, { PureComponent } from "react";

export default class Pipeline extends PureComponent {
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
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 1.5
        }}
        onClick={this.changePosition}
      >
        <g transform="matrix(1,0,0,1,-2188,-4313)">
          <g
            id="Artboard1"
            transform="matrix(1.02759,0,0,1.00382,183.648,4309.23)"
          >
            <rect
              x={1950.92}
              y={4.112}
              width={1868.44}
              height={1075.89}
              style={{ fill: "none" }}
            />
            <clipPath id="_clip1">
              <rect x={1950.92} y={4.112} width={1868.44} height={1075.89} />
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
              <g id="Cycle">
                <g transform="matrix(1.24336,0,0,1.20352,2160.35,280.259)">
                  <rect
                    x={439.408}
                    y={117.232}
                    width={710.095}
                    height={51.921}
                    style={{ fill: "#eee" }}
                  />
                </g>
                <g transform="matrix(-0.27853,0,0,0.390583,3764.66,211.558)">
                  <clipPath id="_clip2">
                    <path d="M626.436,537.305l8.142,82.067l-8.245,77.802l-1.197,-0.001c-125.3,0 -228.214,45.055 -228.218,98.066l0,-161.882l0,-0.002l0,-0.002l0,-0.025l0,0c0.035,-53 103.04,-96.024 228.321,-96.024l1.197,0.001Z" />
                  </clipPath>
                  <g clipPath="url(#_clip2)">
                    <g transform="matrix(-3.49387,0,0,2.55053,6513.24,-532.027)">
                      <use
                        xlinkHref="#_Image3"
                        x={1706.76}
                        y={422.864}
                        width="68.022px"
                        height="101.13px"
                        transform="matrix(0.985826,0,0,0.991473,0,0)"
                      />
                    </g>
                  </g>
                </g>
                <g transform="matrix(-0.27853,0,0,0.390583,3764.66,211.558)">
                  <path
                    d="M625.147,891.427l-1.197,0.001c-125.281,0 -226.997,-43.024 -227.032,-96.024l0,0l0,-0.025l0,-0.002l0,-0.003l0,-161.884l0,0l0,0c0,53.013 101.724,95.447 227.026,95.447l1.198,-0.001l25.847,92.879l-25.842,69.612Z"
                    style={{ fill: "#018081" }}
                  />
                </g>
                <g transform="matrix(1.13952,0,0,0.676332,1955.65,184.299)">
                  <path
                    d="M1437.01,456.526l-292.256,0l0,103.31l292.256,0l20.615,-52.979l-20.615,-50.331Z"
                    style={{
                      fill: "#014981",
                      stroke: "#f2f2f2",
                      strokeWidth: "5.75px"
                    }}
                  />
                </g>
                <g transform="matrix(1.17256,0,0,0.676332,1618.7,184.299)">
                  <path
                    d="M1441.49,456.526l-296.731,0l0,103.31l296.731,0l25.622,-50.246l-25.622,-53.064Z"
                    style={{
                      fill: "#812001",
                      stroke: "#f2f2f2",
                      strokeWidth: "5.62px"
                    }}
                  />
                </g>
                <g transform="matrix(0.87331,0,0,0.676332,1718.71,184.299)">
                  <path
                    d="M1439.49,456.526l-334.343,0l24.055,103.31l310.288,0l38.574,-51.731l-38.574,-51.579Z"
                    style={{
                      fill: "#018081",
                      stroke: "#f2f2f2",
                      strokeWidth: "6.91px"
                    }}
                  />
                </g>
                <g transform="matrix(3.65369,0,0,3.74022,-709.782,-1280.38)">
                  <text
                    x="957.678px"
                    y="486.188px"
                    style={{
                      fontFamily: "'HelveticaNeue-Bold', 'Helvetica Neue'",
                      fontWeight: 700,
                      fontSize: "9.321px",
                      fill: "#fff"
                    }}
                  >
                    Ideation
                  </text>
                </g>
                <g transform="matrix(3.65369,0,0,3.74022,-455.713,-1280.38)">
                  <text
                    x="957.678px"
                    y="486.188px"
                    style={{
                      fontFamily: "'HelveticaNeue-Bold', 'Helvetica Neue'",
                      fontWeight: 700,
                      fontSize: "9.321px",
                      fill: "#fff"
                    }}
                  >
                    Speciﬁcation
                  </text>
                </g>
                <g transform="matrix(3.65369,0,0,3.74022,-140.93,-1280.38)">
                  <text
                    x="957.678px"
                    y="486.188px"
                    style={{
                      fontFamily: "'HelveticaNeue-Bold', 'Helvetica Neue'",
                      fontWeight: 700,
                      fontSize: "9.321px",
                      fill: "#fff"
                    }}
                  >
                    Evaluation
                  </text>
                </g>
                <g transform="matrix(0.26842,0,0,0.390583,2538.89,211.558)">
                  <clipPath id="_clip4">
                    <path d="M625.147,537.305l0,161.887l-1.197,-0.002c-125.3,0 -227.028,43.038 -227.032,96.049l0,-161.882l0,-0.002l0,-0.002l0,-0.025l0,0c0.035,-53 101.751,-96.024 227.032,-96.024l1.197,0.001Z" />
                  </clipPath>
                  <g clipPath="url(#_clip4)">
                    <g transform="matrix(3.62546,-0,-0,2.55053,-2191.92,-532.027)">
                      <use
                        xlinkHref="#_Image5"
                        x={714.622}
                        y={422.864}
                        width="62.952px"
                        height="101.13px"
                        transform="matrix(0.999232,0,0,0.991473,0,0)"
                      />
                    </g>
                  </g>
                </g>
                <g transform="matrix(0.26842,0,0,0.390583,2538.89,211.558)">
                  <path
                    d="M625.147,891.427l-1.197,0.001c-125.281,0 -226.997,-43.024 -227.032,-96.024l0,0l0,-0.025l0,-0.002l0,-0.003l0,-161.884l0,0l0,0c0,53.013 101.724,95.447 227.026,95.447l1.198,-0.001l25.847,92.879l-25.842,69.612Z"
                    style={{ fill: "#018081" }}
                  />
                </g>
              </g>
              <g id="Computer-Arrows" display={this.displayOn(2)}>
                <g transform="matrix(-1.09278,0,0,1.56396,4567.38,-247.442)">
                  <path
                    d="M1297.72,394.2l0,19.713l-268.253,0l0,50.671"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "8.79px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(1.01945,0,0,1.0436,1825.54,-5.89691)">
                  <path
                    d="M1297.99,391.053l0,71.779"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "12.41px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(1.09435,0,0,1.56396,1729.09,-247.442)">
                  <path
                    d="M1297.72,394.2l0,19.713l-268.253,0l0,50.671"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "8.79px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(-1.55101,1.94441e-16,-1.00084e-16,-0.836597,4443.66,884.518)">
                  <path
                    d="M1024.14,465.066l10.751,21.503l-21.503,0l10.752,-21.503Z"
                    style={{ fill: "#b3b3b3" }}
                  />
                </g>
                <g transform="matrix(-1.55101,1.94441e-16,-1.00084e-16,-0.836597,4738.01,884.518)">
                  <path
                    d="M1024.14,465.066l10.751,21.503l-21.503,0l10.752,-21.503Z"
                    style={{ fill: "#b3b3b3" }}
                  />
                </g>
                <g transform="matrix(-1.55101,1.94441e-16,-1.00084e-16,-0.836597,5030.99,884.518)">
                  <path
                    d="M1024.14,465.066l10.751,21.503l-21.503,0l10.752,-21.503Z"
                    style={{ fill: "#b3b3b3" }}
                  />
                </g>
              </g>
              <g id="User-Arrows" display={this.displayOn(2)}>
                <g transform="matrix(1.09605,-1.37406e-16,-1.39015e-16,-1.16203,1727.35,1126.5)">
                  <path
                    d="M1297.72,419.748l0,19.713l-268.253,0l0,25.123"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "10.47px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(-0.172206,2.15886e-17,-2.10892e-17,-0.176284,3372.7,670.267)">
                  <path
                    d="M1297.99,174.982l0,287.85"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "73.46px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(0.120621,-1.51216e-17,7.74622e-18,0.0647505,2992.61,720.859)">
                  <path
                    d="M1297.99,174.982l0,287.85"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "131.36px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(-1.09205,1.36905e-16,-1.35159e-16,-1.12979,4566.88,1112.24)">
                  <path
                    d="M1297.72,420.137l0,19.713l-268.253,0l0,24.734"
                    style={{
                      fill: "none",
                      stroke: "#b3b3b3",
                      strokeWidth: "10.64px",
                      strokeLinecap: "square"
                    }}
                  />
                </g>
                <g transform="matrix(1.55101,-3.88883e-16,2.00167e-16,0.836597,1854.28,178.632)">
                  <path
                    d="M1024.14,465.066l10.751,21.503l-21.503,0l10.752,-21.503Z"
                    style={{ fill: "#b3b3b3" }}
                  />
                </g>
                <g transform="matrix(1.55101,-3.88883e-16,2.00167e-16,0.836597,1561.05,178.632)">
                  <path
                    d="M1024.14,465.066l10.751,21.503l-21.503,0l10.752,-21.503Z"
                    style={{ fill: "#b3b3b3" }}
                  />
                </g>
                <g transform="matrix(1.55101,-3.88883e-16,2.00167e-16,0.836597,1266.77,178.632)">
                  <path
                    d="M1024.14,465.066l10.751,21.503l-21.503,0l10.752,-21.503Z"
                    style={{ fill: "#b3b3b3" }}
                  />
                </g>
              </g>
              <g id="Computer-Terms" display={this.displayOn(4)}>
                <g transform="matrix(1.13514,0,0,1.16203,2278.83,226.482)">
                  <g transform="matrix(-0.253566,0,0,1.67221,1030.2,-548.01)">
                    <rect
                      x={972.198}
                      y={435.139}
                      width={137.968}
                      height={18.314}
                      style={{ fill: "#eee" }}
                    />
                  </g>
                  <g transform="matrix(2.57846,0,0,2.57846,-1804.61,-1052.18)">
                    <text
                      x="957.678px"
                      y="486.188px"
                      style={{
                        fontFamily: "'HelveticaNeue', 'Helvetica Neue'",
                        fontSize: "9.321px"
                      }}
                    >
                      T
                      <tspan x="961.994px 966.999px " y="486.188px 486.188px ">
                        er
                      </tspan>
                      ms Suggestions
                    </text>
                  </g>
                </g>
                <g transform="matrix(-0.287834,0,0,1.78023,3751.83,-338.248)">
                  <rect
                    x={972.198}
                    y={435.139}
                    width={137.968}
                    height={18.314}
                    style={{ fill: "#eee" }}
                  />
                </g>
                <g transform="matrix(2.92692,0,0,2.99624,510.95,-994.476)">
                  <text
                    x="957.678px"
                    y="486.188px"
                    style={{
                      fontFamily: "'HelveticaNeue', 'Helvetica Neue'",
                      fontSize: "9.321px"
                    }}
                  >
                    Matched Documents
                  </text>
                </g>
                <g transform="matrix(1.13514,0,0,1.16203,2281.31,224.373)">
                  <g transform="matrix(-0.368852,0,0,1.67221,891.394,-548.01)">
                    <rect
                      x={972.198}
                      y={435.139}
                      width={137.968}
                      height={18.314}
                      style={{ fill: "#eee" }}
                    />
                  </g>
                  <g transform="matrix(2.57846,0,0,2.57846,-2031.19,-1049.92)">
                    <text
                      x="957.678px"
                      y="486.188px"
                      style={{
                        fontFamily: "'HelveticaNeue', 'Helvetica Neue'",
                        fontSize: "9.321px"
                      }}
                    >
                      Label Seeds
                    </text>
                  </g>
                </g>
              </g>
              <g id="User-Terms" display={this.displayOn(3)}>
                <g transform="matrix(2.92692,0,0,2.99624,281.05,-780.835)">
                  <text
                    x="957.678px"
                    y="486.188px"
                    style={{
                      fontFamily: "'HelveticaNeue', 'Helvetica Neue'",
                      fontSize: "9.321px"
                    }}
                  >
                    T
                    <tspan x="961.994px 966.999px " y="486.188px 486.188px ">
                      as
                    </tspan>
                    k Goals
                  </text>
                </g>
                <g transform="matrix(2.92692,0,0,2.99624,192.558,-743.204)">
                  <text
                    x="957.678px"
                    y="486.188px"
                    style={{
                      fontFamily: "'HelveticaNeue', 'Helvetica Neue'",
                      fontSize: "9.321px"
                    }}
                  >
                    Domain/Data Knowledge
                  </text>
                </g>
              </g>
              <g id="Computer" display={this.displayOn(1)}>
                <g transform="matrix(3.06321,0,0,3.13575,3113.01,225.386)">
                  <path
                    d="M15,9l-6,0l0,6l6,0l0,-6Zm-2,4l-2,0l0,-2l2,0l0,2Zm8,-2l0,-2l-2,0l0,-2c0,-1.1 -0.9,-2 -2,-2l-2,0l0,-2l-2,0l0,2l-2,0l0,-2l-2,0l0,2l-2,0c-1.1,0 -2,0.9 -2,2l0,2l-2,0l0,2l2,0l0,2l-2,0l0,2l2,0l0,2c0,1.1 0.9,2 2,2l2,0l0,2l2,0l0,-2l2,0l0,2l2,0l0,-2l2,0c1.1,0 2,-0.9 2,-2l0,-2l2,0l0,-2l-2,0l0,-2l2,0Zm-4,6l-10,0l0,-10l10,0l0,10Z"
                    style={{ fill: "#252525", fillRule: "nonzero" }}
                  />
                </g>
                <g transform="matrix(5.915,0,0,6.05508,3078.79,208.734)">
                  <path
                    d="M21,2l-18,0c-1.1,0 -2,0.9 -2,2l0,12c0,1.1 0.9,2 2,2l7,0l-2,3l0,1l8,0l0,-1l-2,-3l7,0c1.1,0 2,-0.9 2,-2l0,-12c0,-1.1 -0.9,-2 -2,-2Zm0,12l-18,0l0,-10l18,0l0,10Z"
                    style={{ fill: "#018081", fillRule: "nonzero" }}
                  />
                </g>
              </g>
              <g
                id="User"
                display={this.displayOn(1)}
                transform="matrix(6.48728,0,0,6.6409,3071.92,742.559)"
              >
                <path
                  d="M12,12c2.21,0 4,-1.79 4,-4c0,-2.21 -1.79,-4 -4,-4c-2.21,0 -4,1.79 -4,4c0,2.21 1.79,4 4,4Zm0,2c-2.67,0 -8,1.34 -8,4l0,2l16,0l0,-2c0,-2.66 -5.33,-4 -8,-4Z"
                  style={{ fill: "#018081", fillRule: "nonzero" }}
                />
              </g>
              <g id="Title">
                <g transform="matrix(1.65615,0,0,1.69537,-2164.13,-6966.52)">
                  <text
                    x="2556.04px"
                    y="4408.86px"
                    style={{
                      fontFamily: "'GillSans', 'Gill Sans', sans-serif",
                      fontSize: 48,
                      fill: "#474444"
                    }}
                  >
                    Explorator
                    <tspan x="2767.44px " y="4408.86px ">
                      y
                    </tspan>
                  </text>
                  <text
                    x="2631.93px"
                    y="4456.86px"
                    style={{
                      fontFamily: "'GillSans', 'Gill Sans', sans-serif",
                      fontSize: 48,
                      fill: "#474444"
                    }}
                  >
                    Labeling
                  </text>
                </g>
                <g transform="matrix(0.973148,0,0,0.375787,-189.454,-1296.18)">
                  <path
                    d="M2790.25,4470.53l0,780.083"
                    style={{
                      fill: "none",
                      stroke: "#b7b7b7",
                      strokeWidth: "5.95px"
                    }}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
        <defs>
          <image
            id="_Image3"
            width="69px"
            height="102px"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABmCAYAAACdtVyxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAClUlEQVR4nO2cUXLDIAxEt73/WXOF9KeZ8WRsg0DSLsL708YZQ/O6BlbG+Xm9Xm9M6P2+Pv3sveMxy++Wn61jV68/x34bn3lLpUK5c1VGn739b+2Uq8tbGgrDWUAxp3hBXAKKp2N62loCSkuWqb/nXDkorHHkqCkorA8Q3W+YUyL+8O82vfr4bkfu8slQCyYNyshK09ru6HlbOqWlNCir5B5gY6fcrW1koTDXK7JQrPKcnstA6VGZekrrg7Ryz0jbUlAyVsE9koKiomEo1jg+q6vqvVe7Rz1OOREFCjP39AzMj1NOlAJlpdwDbOqU1iUkCYVdp5WEYpX39FwCSo/K1FMYuQcQgqKSe7YrHfRqCErl3AMIXT5KSoeinnuAxymnCofCXp0+lbd/zWxjBQShsJ0FCEKxKmJ6Xh5Kj8rUU1i5BxCBopR7ABEoajJDqZ57gMcpp6I9xZG9HrEMzCWc4g04FAp7dTrafwmnHDWbewAxKGxnfSQFxapnG/qgytRTInNPj+hQsnPP1XvblQ6sMkFhP/SUkXsAR6eoxH8P0fe8sfqTSMlRICLaXeoZwqz+S80+XgUwGSjsHZRHyUBhST4lWxTpLDkonrlnySKTYu4BBJ2ioG4ou+QewMkplXIPQN7zxupP4gb7SrkHCILCzj2zKjP73N2SLbNpJ1oS9ZQ7saf7b0lAsSoaohSUmS1ZHm19JPGdTF7neOQeQMwpKuqCojYQRrc37ZSM3JP9Tyl9+YzeiE99tCX7oadRlXbKqNyhsG9VeIxHWzpFop5yJ8Xpng7FqgyIMlBUcg8gBKWlrNwDbLJpx6omFMWBMLo9uW9DZ+ceYKExxSrZIpNa7kkrHVSUKxS13DOq0k6RrafcSXW98ge2Etra/T3WygAAAABJRU5ErkJggg=="
          />
          <image
            id="_Image5"
            width="63px"
            height="102px"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAABmCAYAAAB83kngAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABB0lEQVR4nO3aUQ6CMBAAUev9j8d96o8xhKCAFLrbmZcYBfkZlwBByjRN9fFWSvm8fi1/+25tmyPvW+uWn9eWt9bPPTe3GNjp+FrrrnUROXkq46mMpzKeyngq46mMpzKeyngq46mMp0off+Y2efr4M4ynMj6Tlv8DpotvyXgq46mMpzK+t14PMIWI78V4KuOpjKe6ND76A8hOnsp4KuOpjKcynsr4pejX5K04eSrjqYynMp7K+C2jXvE5eSrjqYwf0Z4z1LDxe9wSH/U6wclHdMfeEjb+DsZTGd9C1NPZL06eyngq4/+V8Qg/5+SpjKc6HJ/9IDfn5HvpvRelmPxVP1KK+KsYT/UC47o0ZUBRFLEAAAAASUVORK5CYII="
          />
        </defs>
      </svg>
    );
  }
}
