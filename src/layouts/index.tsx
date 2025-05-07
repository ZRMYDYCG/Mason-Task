import { Outlet } from 'react-router-dom'
import useRouteAuth from '@/hooks/useRouteAuth'
import NavSide from './components/nav-side.tsx'

const Layouts = () => {
  useRouteAuth()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* NavSide Start */}
      <NavSide />
      {/* NavSide End */}

      {/* Content Start */}
      <div className="flex-1 overflow-hidden bg-[#f8f9ff]">
        <div className="h-full overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </div>
      {/* Content End */}
    </div>
  )
}

export default Layouts
