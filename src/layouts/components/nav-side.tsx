import { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarOutlined, FileOutlined, HomeOutlined, ProjectOutlined } from '@ant-design/icons'
import ProjectList from './project-list.tsx'
import Logo from './logo.tsx'
import UserSetting from './user-setting.tsx'
import clsx from 'clsx'

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
      icon: <HomeOutlined className="transform text-[17px] transition-transform hover:scale-110" />,
    },
    {
      name: '日历',
      path: '/calendar',
      icon: (
        <CalendarOutlined className="transform text-[17px] transition-transform hover:scale-110" />
      ),
    },
    {
      name: '消息',
      path: '/message',
      icon: (
        <ProjectOutlined className="transform text-[17px] transition-transform hover:scale-110" />
      ),
    },
    {
      name: '文件',
      path: '/file',
      icon: <FileOutlined className="transform text-[17px] transition-transform hover:scale-110" />,
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
    <div className="flex h-full w-[240px] flex-col border-[1px] border-r border-gray-200 bg-gradient-to-b from-[#fafbff] to-[#e9eef7]">
      <Logo />
      <div className="flex-1 overflow-hidden px-3">
        <div className="mb-6">
          {navList.map((item, index) => (
            <div
              key={index}
              className={clsx(
                'group relative mb-2 flex h-12 cursor-pointer items-center rounded-xl px-3 transition-all',
                'hover:bg-white hover:shadow-[0_4px_12px_rgba(59,130,246,0.08)]',
                currentPath === item.path
                  ? 'bg-white shadow-[0_4px_12px_rgba(59,130,246,0.12)]'
                  : 'hover:-translate-x-1'
              )}
              onClick={() => clickNav(item)}
            >
              <div
                className={clsx(
                  'absolute left-0 h-5 w-[4px] rounded-e-full transition-all',
                  currentPath === item.path
                    ? 'bg-gradient-to-b from-blue-500 to-blue-400'
                    : 'bg-blue-100 opacity-0 group-hover:opacity-100'
                )}
              />
              <div className="flex items-center text-gray-600">{item.icon}</div>
              <div className="ml-3 text-sm font-medium text-gray-700 transition-colors group-hover:text-blue-600">
                {item.name}
              </div>
            </div>
          ))}
        </div>
        <ProjectList ref={projectRef} setPath={setPath} />
      </div>
      <UserSetting />
    </div>
  )
}

export default NavSide
