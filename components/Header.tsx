import { YuqueLink } from './Links/YuequeLink'

export function Header() {
  return (
    <header className="fixed top-0 z-10  flex w-full border-b bg-white bg-opacity-70 backdrop-blur-lg backdrop-filter">
      <h1 className="m-4 font-bold lg:mx-8">
        <div className="relative inline-block text-blue-600">
          <span className="text-3xl md:text-5xl lg:text-6xl">绮课</span>
          <span className="pl-2 text-2xl font-light text-gray-600">
            cheerTimetable
          </span>
        </div>
      </h1>
    </header>
  )
}
