import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Layouts = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('task-token')
    if (!token) {
      navigate('/login')
    }
  }, [])
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
