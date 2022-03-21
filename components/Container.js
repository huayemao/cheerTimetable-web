export default function Container({ children, className = '' }) {
  return (
    <div className={'container mx-auto h-full py-2 md:px-5 ' + className}>
      {children}
    </div>
  )
}
