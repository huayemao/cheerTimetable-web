import * as React from 'react'

const SvgComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        margin: 'auto',
        background: 'transparent',
        display: 'block',
      }}
      width={props.size}
      height={props.size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <g transform="translate(80 50)">
        <circle r={6} fill="#60a5fa">
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.875s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.875s"
          />
        </circle>
      </g>
      <g transform="rotate(45 -50.355 121.569)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.875}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.75s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.75s"
          />
        </circle>
      </g>
      <g transform="rotate(90 -15 65)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.75}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.625s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.625s"
          />
        </circle>
      </g>
      <g transform="rotate(135 -.355 41.569)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.625}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.5s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.5s"
          />
        </circle>
      </g>
      <g transform="rotate(180 10 25)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.5}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.375s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.375s"
          />
        </circle>
      </g>
      <g transform="rotate(-135 20.355 8.431)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.375}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.25s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.25s"
          />
        </circle>
      </g>
      <g transform="rotate(-90 35 -15)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.25}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.125s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="-0.125s"
          />
        </circle>
      </g>
      <g transform="rotate(-45 70.355 -71.569)">
        <circle r={6} fill="#60a5fa" fillOpacity={0.125}>
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="0s"
            values="1.5 1.5;1 1"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            keyTimes="0;1"
            dur="1s"
            repeatCount="indefinite"
            values="1;0"
            begin="0s"
          />
        </circle>
      </g>
    </svg>
  )
}

export default SvgComponent
