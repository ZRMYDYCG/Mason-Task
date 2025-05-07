import { useState } from 'react'
import { Dropdown, Avatar } from 'antd'
import { UserOutlined, SettingOutlined } from '@ant-design/icons'

const UserSetting = () => {
  const [open, setOpen] = useState(false)

  const menuItems = [
    {
      key: '1',
      label: (
        <div className="flex w-full items-center justify-between">
          <span>设置</span>
          <SettingOutlined />
        </div>
      ),
    },
  ]

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      open={open}
      placement="top"
      onOpenChange={handleOpenChange}
      overlayClassName="absolute right-0 w-48 rounded-md shadow-lg z-10"
      trigger={['click']}
    >
      <div className="hover:bg-gray1-00 flex cursor-pointer items-center justify-between rounded-md p-2">
        <div className="flex items-center">
          <Avatar size={30} icon={<UserOutlined />} className="bg-gray-200 text-gray-600" />
          <span className="ml-3 font-medium">用户6808</span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </Dropdown>
  )
}

export default UserSetting
