import * as React from 'react'

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path
      d="M8.484 12.281V8.883c0-1.781.211-3.242.633-4.383.438-1.14 1.172-2.11 2.203-2.906A8.39 8.39 0 0 1 14.836 0v2.719c-.922.531-1.445 1.242-1.57 2.133h1.57v7.43H8.484Zm-8.484 0V8.883C0 7.102.21 5.64.633 4.5c.437-1.14 1.172-2.11 2.203-2.906A8.57 8.57 0 0 1 6.352 0v2.719c-.922.531-1.446 1.242-1.57 2.133h1.57v7.43H0Z"
      fill="var(--text-primary)"
    />
  </svg>
)

export default SvgComponent
