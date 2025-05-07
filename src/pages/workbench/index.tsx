import { useState, useEffect } from 'react'
import { LoginUser, TaskItem } from '@/api/type'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import api from '../../api'
import dayjs from 'dayjs'
import { Tag, Empty, Button } from 'antd'
import Task from './components/task.tsx'

const Home = () => {
  const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']

  const [todayTaskList, setTodayTaskList] = useState<TaskItem[]>([])
  const [overTaskList, setOverTaskList] = useState<TaskItem[]>([])
  const [unCompleteList, setUnCompleteList] = useState<TaskItem[]>([])
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [isLoading, setIsLoading] = useState(true)

  const getTaskList = () => {
    setIsLoading(true)
    api.user
      .findTask({
        id: user.id,
      })
      .then(res => {
        setTodayTaskList(
          res.data.filter(item => {
            const diff = dayjs(item.endTime).diff(dayjs().startOf('day'))
            return diff >= 0 && diff < 1000 * 60 * 60 * 24 && item.status !== 3
          })
        )
        setOverTaskList(
          res.data.filter(item => {
            const diff = dayjs(item.endTime).diff(dayjs().startOf('day'))
            return diff < 0 && item.status !== 3
          })
        )
        setUnCompleteList(res.data.filter(item => item.status !== 3))
      })
      .finally(() => setIsLoading(false))
  }

  const diffTime = (time: string) => {
    const endTime = dayjs(time)
    const diff = endTime.diff(currentTime, 'millisecond')
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    if (diff > 0) {
      if (days >= 1) {
        return (
          <Tag className="flex items-center space-x-1 border-blue-200 bg-blue-100 text-blue-800">
            <ClockCircleOutlined className="text-blue-500" />
            <span>
              {days !== 0 ? days + '天,' : null}
              {hours}小时
            </span>
          </Tag>
        )
      }
      return (
        <Tag className="flex items-center space-x-1 border-orange-200 bg-orange-100 text-orange-800">
          <ClockCircleOutlined className="text-orange-500" />
          <span>
            {days !== 0 ? days + '天,' : null}
            {hours < 10 ? '0' + hours : hours}:{minutes < 10 ? '0' + minutes : minutes}:
            {seconds < 10 ? '0' + seconds : seconds}
          </span>
        </Tag>
      )
    } else {
      if (days === -1) {
        return (
          <Tag className="flex items-center space-x-1 border-red-200 bg-red-100 text-red-800">
            <ExclamationCircleOutlined className="text-red-500" />
            <span>
              {hours < 10 ? '-0' + Math.abs(hours) : Math.abs(hours)}:
              {minutes < 10 ? '0' + Math.abs(minutes) : Math.abs(minutes)}:
              {seconds < 10 ? '0' + Math.abs(seconds) : Math.abs(seconds)}
            </span>
          </Tag>
        )
      }
      return (
        <Tag className="flex items-center space-x-1 border-red-200 bg-red-100 text-red-800">
          <ExclamationCircleOutlined className="text-red-500" />
          <span>
            {days !== 0 ? days + '天,' : null}
            {Math.abs(hours)}小时
          </span>
        </Tag>
      )
    }
  }

  useEffect(() => {
    getTaskList()
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    overTaskList.map(item => {
      item.diffTime = diffTime(item.endTime)
    })
    unCompleteList.map(item => {
      item.diffTime = diffTime(item.endTime)
    })
    setOverTaskList([...overTaskList])
    setUnCompleteList([...unCompleteList])
  }, [currentTime])

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
            欢迎回来, <span className="text-indigo-600">{user?.username}</span>
          </h1>
          <p className="mt-2 text-gray-500">以下是你的任务概览</p>

          <div className="mt-4 flex items-center text-sm text-gray-400">
            <ClockCircleOutlined className="mr-1" />
            {currentTime.format('YYYY年MM月DD日 HH:mm:ss')}
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">今日到期</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-800">{todayTaskList.length}</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-4">
                <FileTextOutlined className="text-xl text-blue-600" />
              </div>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">今天结束的任务</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">超期任务</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-800">{overTaskList.length}</h3>
              </div>
              <div className="rounded-full bg-red-100 p-4">
                <ExclamationCircleOutlined className="text-xl text-red-600" />
              </div>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">已超期任务</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">待完成任务</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-800">{unCompleteList.length}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircleOutlined className="text-xl text-green-600" />
              </div>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">未完成任务</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {overTaskList.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <div className="mb-6 flex items-center">
                    <div className="mr-3 h-6 w-2 rounded-full bg-red-500"></div>
                    <h2 className="text-xl font-bold text-gray-800">超期任务</h2>
                    <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      {overTaskList.length} 项
                    </span>
                  </div>
                  <Task taskList={overTaskList} getTaskList={getTaskList} />
                </div>
              )}

              {unCompleteList.length > 0 ? (
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <div className="mb-6 flex items-center">
                    <div className="mr-3 h-6 w-2 rounded-full bg-indigo-500"></div>
                    <h2 className="text-xl font-bold text-gray-800">待完成任务</h2>
                    <span className="ml-2 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                      {unCompleteList.length} 项
                    </span>
                  </div>
                  <Task taskList={unCompleteList} getTaskList={getTaskList} />
                </div>
              ) : (
                !overTaskList.length && (
                  <div className="rounded-xl bg-white p-12 text-center shadow-md">
                    <Empty
                      description={
                        <span className="text-gray-500">
                          暂无任务数据，开始创建你的第一个任务吧
                        </span>
                      }
                    />
                    <Button
                      className="mt-6 bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
                      onClick={() => {
                        /* 处理创建任务 */
                      }}
                    >
                      创建任务
                    </Button>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
