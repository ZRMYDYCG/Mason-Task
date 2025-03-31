import { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarOutlined, FileOutlined, HomeOutlined, ProjectOutlined } from '@ant-design/icons'
import ProjectList from './project-list.tsx'
import UserInfo from './user-info.tsx'

interface Nav {
  name: string
  path: string
  icon: JSX.Element
}

interface ProjectRef {
  setCurrentProject: (val: number) => void
}

const NavSide = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentPath, setCurrentPath] = useState('')
  const projectRef = useRef<ProjectRef | null>(null)

  const navList: Nav[] = [
    {
      name: '工作台',
      path: '/',
      icon: <HomeOutlined />,
    },
    {
      name: '日历',
      path: '/calendar',
      icon: <CalendarOutlined />,
    },
    {
      name: '消息',
      path: '/message',
      icon: <ProjectOutlined />,
    },
    {
      name: '文件',
      path: '/file',
      icon: <FileOutlined />,
    },
  ]

  const clickNav = (item: Nav) => {
    setCurrentPath(item.path)
    navigate(item.path)
    projectRef.current?.setCurrentProject(-1)
  }

  const setPath = (val: string) => {
    setCurrentPath(val)
  }

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [])

  return (
    <div className="p-5">
      <UserInfo />
      <div className="my-5">
        {navList.map((item, index) => {
          return (
            <div
              key={index}
              className="mb-3 flex cursor-pointer items-center p-3"
              style={{ background: currentPath === item.path ? '#fff' : 'inherit' }}
              onClick={() => clickNav(item)}
            >
              <div className="flex items-center text-lg text-[#d9d9da]">{item.icon}</div>
              <div className="ml-4 text-[#6b6e72]">{item.name}</div>
            </div>
          )
        })}
      </div>
      <ProjectList ref={projectRef} setPath={setPath} />
    </div>
  )
}

export default NavSide
