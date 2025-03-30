import { Outlet } from 'react-router-dom'
import useRouteAuth from '@/hooks/useRouteAuth'

const Layouts = () => {
  useRouteAuth()
  return (
    <div className="flex h-full w-full">
      <div className="h-full w-[300px] bg-[#f4f5f7]"></div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Layouts
