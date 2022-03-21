import * as React from 'react'

const SvgComponent = (props) => (
  <svg
    className="h-6 w-6 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 125"
    {...props}
  >
    <path d="M30.7 42c0 6.1 12.6 7 12.6 22 0 11-7.9 19.2-18.9 19.2C12.7 83.1 5 72.6 5 61.5c0-19.2 18-44.6 29.2-44.6 2.8 0 7.9 2 7.9 5.4S30.7 31.6 30.7 42zm51.7 0c0 6.1 12.6 7 12.6 22 0 11-7.9 19.2-18.9 19.2-11.8 0-19.5-10.5-19.5-21.6 0-19.2 18-44.6 29.2-44.6 2.8 0 7.9 2 7.9 5.4S82.4 31.6 82.4 42z" />
  </svg>
)

export default SvgComponent
