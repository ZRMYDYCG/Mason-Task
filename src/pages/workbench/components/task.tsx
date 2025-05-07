import { useState } from 'react'
import { Tag, Tooltip, Divider } from 'antd'
import { TaskItem } from '@/api/type'
import UpdateTask from './update-task'
import TaskSetting from './task-setting'

interface Props {
  taskList: TaskItem[]
  getTaskList: () => void
}

const Task = (props: Props) => {
  const { taskList, getTaskList } = props
  const [visible, setVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskItem>()

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Tag color="#ff4d4f" className="text-xs md:text-sm">
            待处理
          </Tag>
        )
      case 1:
        return (
          <Tag color="#fa8c16" className="text-xs md:text-sm">
            进行中
          </Tag>
        )
      case 2:
        return (
          <Tag color="#1890ff" className="text-xs md:text-sm">
            待测试
          </Tag>
        )
      case 3:
        return (
          <Tag color="#52c41a" className="text-xs md:text-sm">
            已完成
          </Tag>
        )
      case 4:
        return (
          <Tag color="#faad14" className="text-xs md:text-sm">
            已取消
          </Tag>
        )
      default:
        return null
    }
  }

  const renderPriority = (level: string) => {
    switch (level) {
      case 'P0':
        return <Tag color="#f5222d">P0</Tag>
      case 'P1':
        return <Tag color="#fa8c16">P1</Tag>
      case 'P2':
        return <Tag color="#1890ff">P2</Tag>
      case 'P3':
        return <Tag color="#52c41a">P3</Tag>
      default:
        return <Tag color="#d9d9d9">未分级</Tag>
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-2 sm:px-4">
        {taskList.length > 0 ? (
          <div className="mt-4 space-y-3">
            {taskList.map(item => (
              <div
                key={item.id}
                className="group relative flex cursor-pointer flex-col rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:shadow-md md:p-4"
                style={{ backgroundColor: item.bgColor || '#fff' }}
                onClick={() => {
                  setCurrentTask(item)
                  setVisible(true)
                }}
              >
                <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
                  <TaskSetting task={item} getTaskDetail={getTaskList}>
                    <div
                      className="h-5 w-5 cursor-pointer rounded-full bg-white p-1 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-gray-100"
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3 w-3 text-gray-500"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  </TaskSetting>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 hidden md:block">{renderPriority(item.level)}</div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="mr-2 md:hidden">{renderPriority(item.level)}</div>
                      <div className="flex-1 truncate text-sm font-medium text-gray-800 md:text-base">
                        {item.name}
                      </div>
                    </div>

                    {item.desc && (
                      <div className="mt-1 line-clamp-2 text-xs text-gray-600 md:text-sm">
                        {item.desc}
                      </div>
                    )}
                  </div>
                </div>

                <Divider className="my-2" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {renderStatus(item.status)}
                    <Tooltip title={`创建时间: ${new Date(item.createAt).toLocaleString()}`}>
                      <span className="text-xs text-gray-500">{formatDateTime(item.createAt)}</span>
                    </Tooltip>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Tooltip title={`开始时间: ${item.startTime}`}>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(item.startTime)}
                      </span>
                    </Tooltip>
                    <span className="text-gray-300">→</span>
                    <Tooltip title={`截止时间: ${item.endTime}`}>
                      <span className="text-xs text-gray-500">{formatDateTime(item.endTime)}</span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div className="text-gray-500">暂无任务</div>
            <div className="text-sm text-gray-400">点击右上角创建新任务</div>
          </div>
        )}
      </div>

      <UpdateTask
        task={currentTask as TaskItem}
        visible={visible}
        setVisible={setVisible}
        getTaskDetail={getTaskList}
      />
    </>
  )
}

export default Task
