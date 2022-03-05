import * as React from 'react'

const SvgComponent = (props) => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m7 20 4-16m2 16 4-16M6 9h14M4 15h14"
    />
  </svg>
)

export default SvgComponent
