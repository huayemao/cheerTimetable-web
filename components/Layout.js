export default function Layout({ preview, children }) {
  return (
    <>
      <div className="min-h-screen sm:h-screen">
        <main>{children}</main>
      </div>
    </>
  )
}
