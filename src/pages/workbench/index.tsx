import { useState, useEffect } from 'react'
import { LoginUser, TaskItem } from '@/api/type'
import { FileTextOutlined } from '@ant-design/icons'
import api from '../../api'
import dayjs from 'dayjs'
import { Tag, Empty } from 'antd'
import Task from './components/task.tsx'

const Home = () => {
  const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']

  const [todayTaskList, setTodayTaskList] = useState<TaskItem[]>([])
  const [overTaskList, setOverTaskList] = useState<TaskItem[]>([])
  const [unCompleteList, setUnCompleteList] = useState<TaskItem[]>([])
  const [currentTime, setCurrentTime] = useState(dayjs())

  const getTaskList = () => {
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
          <Tag>
            {days !== 0 ? days + 'd,' : null}
            {hours}h
          </Tag>
        )
      }
      return (
        <Tag color="orange">
          {days !== 0 ? days + 'd,' : null}
          {hours < 10 ? '0' + hours : hours}:{minutes < 10 ? '0' + minutes : minutes}:
          {seconds < 10 ? '0' + seconds : seconds}
        </Tag>
      )
    } else {
      if (days === -1) {
        return (
          <Tag color="red">
            {Math.abs(hours) < 10 ? '-0' + Math.abs(hours) : hours}:
            {Math.abs(minutes) < 10 ? '0' + Math.abs(minutes) : Math.abs(minutes)}:
            {Math.abs(seconds) < 10 ? '0' + Math.abs(seconds) : Math.abs(seconds)}
          </Tag>
        )
      }
      return (
        <Tag color="red">
          {days !== 0 ? days + 'd, ' : null}
          {Math.abs(hours)}h
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
    <div className="h-full w-full">
      {/* 头部区域 */}
      <div className="mx-auto mt-5 w-[90%] py-4 text-xl font-bold md:w-[660px] md:text-2xl">
        欢迎您，{user?.username}
      </div>
      <div className="mx-auto mb-3 w-[90%] py-3 text-sm text-[#888] md:w-[660px]">
        以下是你当前的任务统计数据
      </div>

      {/* 统计卡片容器 */}
      <div className="mx-auto flex w-[90%] flex-col space-y-4 md:w-[660px] md:flex-row md:space-y-0 md:space-x-6">
        {/* 今日到期卡片 */}
        <div className="flex flex-1 cursor-pointer flex-col justify-center rounded-lg bg-[#6f9ef6] px-4 py-4 md:px-6">
          <div className="mb-3 text-sm text-white md:text-base">今日到期</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-xl md:text-2xl">{todayTaskList.length}</div>
            <FileTextOutlined className="text-lg md:text-xl" />
          </div>
        </div>

        {/* 超期任务卡片 */}
        <div className="flex flex-1 cursor-pointer flex-col justify-center rounded-lg bg-[#fa8e8c] px-4 py-4 md:px-6">
          <div className="mb-3 text-sm text-white md:text-base">超期任务</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-xl md:text-2xl">{overTaskList.length}</div>
            <FileTextOutlined className="text-lg md:text-xl" />
          </div>
        </div>

        {/* 待完成任务卡片 */}
        <div className="flex flex-1 cursor-pointer flex-col justify-center rounded-lg bg-[#98de6e] px-4 py-4 md:px-6">
          <div className="mb-3 text-sm text-white md:text-base">待完成任务</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-xl md:text-2xl">{unCompleteList.length}</div>
            <FileTextOutlined className="text-lg md:text-xl" />
          </div>
        </div>
      </div>

      {/* 任务列表区域 */}
      <div className="mx-auto mt-8 w-[90%] md:w-[660px]">
        {overTaskList.length ? (
          <div>
            <div className="text-base font-bold">超期任务</div>
            <div className="mt-4">
              <Task taskList={overTaskList} getTaskList={getTaskList} />
            </div>
          </div>
        ) : null}

        {unCompleteList.length ? (
          <div>
            <div className="mt-5 text-base font-bold">待完成任务</div>
            <div className="mt-4">
              <Task taskList={unCompleteList} getTaskList={getTaskList} />
            </div>
          </div>
        ) : (
          <div>
            <Empty description="暂无任务数据" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
