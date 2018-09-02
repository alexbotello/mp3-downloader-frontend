import React from 'react';

export default props => {
  return (
    <svg
      width="63px"
      height="63px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-reload"
      style={{"background": "none"}}
    >
      <g transform="rotate(115.396 50 50)">
        <path
          d="M50 15A35 35 0 1 0 74.787 25.213"
          fill="none"
          ng-attr-stroke="{{config.color}}"
          ng-attr-stroke-width="{{config.width}}"
          stroke="#1dc4a2"
          strokeWidth="12">
        </path>
        <path
          ng-attr-d="{{config.darrow}}"
          ng-attr-fill="{{config.color}}"
          d="M49 3L49 27L61 15L49 3"
          fill="#1dc4a2">
        </path>
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="1.6s"
          begin="0s"
          repeatCount="indefinite">
        </animateTransform>
      </g>
    </svg>
  )
}
