import { useEffect, useState } from 'react'
import { LoginUser } from '@/api/type'
import { Avatar, Typography, theme } from 'antd'

const { Text } = Typography

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<LoginUser['user']>()
  const { token } = theme.useToken()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']
    setUserInfo(user)
  }, [])

  if (!userInfo) return null

  return (
    <div className="p-4">
      <div
        className="flex items-center rounded-lg p-4 transition-shadow hover:shadow-md"
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div className="flex-shrink-0">
          {userInfo.avatar ? (
            <Avatar size={40} src={userInfo.avatar} className="border-2 border-white shadow" />
          ) : (
            <Avatar
              size={40}
              className="border-2 border-white shadow"
              style={{
                backgroundColor: '#028955',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {userInfo.username.slice(0, 2).toUpperCase()}
            </Avatar>
          )}
        </div>
        <div className="ml-4 overflow-hidden">
          <Text strong ellipsis className="block text-base">
            {userInfo.username}
          </Text>
          {userInfo.email && (
            <Text type="secondary" ellipsis className="block text-sm">
              {userInfo.email}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserInfo
