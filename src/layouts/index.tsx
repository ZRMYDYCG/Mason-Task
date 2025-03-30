import { Outlet } from 'react-router-dom'
import useRouteAuth from '@/hooks/useRouteAuth'
import useResizable from '@/hooks/useResizable'
import NavSide from './components/nav-side.tsx'

const Layouts = () => {
  useRouteAuth()

  const { width, handleMouseDown } = useResizable({
    minWidth: 200,
    maxWidth: 400,
    initialWidth: 300,
  })

  return (
    <div className="flex h-full w-full">
      <div className="relative h-full bg-[#f4f5f7]" style={{ width: `${width}px` }}>
        <NavSide />
        <div
          className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#f4f5f7] active:bg-[#f4f5f7]"
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Layouts
