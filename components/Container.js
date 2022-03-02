export default function Container({ children }) {
  return (
    <div className="container mx-auto h-full py-2 md:px-5">
      {children}
    </div>
  )
}
