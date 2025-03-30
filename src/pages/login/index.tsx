import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import api from '@/api'
import LoginPanel from '@/assets/login/login-panel.svg'
import { useState } from 'react'
import SliderVerify from './components/slider-verify.tsx'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const onFinish = (values: { username: string; password: string }) => {
    if (!isVerified) {
      message.warning('请先完成滑动验证')
      return
    }

    setLoading(true)
    api.user
      .login(values)
      .then(res => {
        if (res.code === 200) {
          message.success(res.msg)
          localStorage.setItem('task-token', res.data.token)
          localStorage.setItem('task-user', JSON.stringify(res.data.user))
          navigate('/')
        } else {
          console.log(res)
          message.error(res.msg)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const register = () => {
    navigate('/register')
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#f8f8f8]">
      <Card
        extra={
          <div className="flex text-sm">
            <div className="text-[#aaa]">还没有账号?</div>
            <div className="ml-2 cursor-pointer text-[#1677ff]" onClick={register}>
              注册账号
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="md:basis-1/2">
            <img className="h-full w-full" src={LoginPanel} alt="login-panel" />
          </div>
          <div className="md:basis-1/2">
            <div className="mb-5 flex items-center justify-center gap-2">
              <div className="h-12 w-12">
                <img src="/logo.svg" alt="logo" />
              </div>
              <span className="text-2xl font-bold">Mason Pro Task</span>
            </div>
            <div className="mb-6 text-center text-sm text-[#aaa]">欢迎使用现代化的任务管理工具</div>
            <Form
              name="basic"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              style={{ width: '100%', maxWidth: 400 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '用户名不能为空' },
                  { min: 2, max: 6, message: '用户名在2-6位之间' },
                ]}
              >
                <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '密码不能为空' },
                  { min: 6, max: 15, message: '密码在6-15位之间' },
                ]}
              >
                <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
              </Form.Item>

              <SliderVerify
                onVerifySuccess={() => setIsVerified(true)}
                onVerifyFail={() => setIsVerified(false)}
                disabled={isVerified}
              />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  disabled={loading || !isVerified}
                  className={!isVerified ? 'opacity-50' : ''}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
      <footer className="hidden md:fixed md:bottom-[5px] md:flex md:w-full md:justify-center">
        <div className="flex items-center gap-4 text-sm text-[#aaa]">
          <span>© {new Date().getFullYear()} Mason Pro Task - 让你的任务不再"待办"</span>
          <span>•</span>
          <span>版本 v1.0.0</span>
          <span>•</span>
          <span>
            Made with <span className="text-red-500">❤️</span> by Mason Team
          </span>
          <img src="/logo.svg" alt="logo" className="h-4 w-4 animate-pulse" />
        </div>
      </footer>
    </div>
  )
}

export default Login
