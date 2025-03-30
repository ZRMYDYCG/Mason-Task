import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const useRouteAuth = (options?: { redirectPath?: string }) => {
  const navigate = useNavigate()
  const { redirectPath = '/login' } = options || {}

  useEffect(() => {
    const token = localStorage.getItem('task-token')
    if (!token) {
      navigate(redirectPath, { replace: true }) // 使用 replace 防止回退
    }
  }, [navigate, redirectPath])
}

export default useRouteAuth
