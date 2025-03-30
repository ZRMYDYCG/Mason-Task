import { useState } from 'react'
import { Tag, Tooltip } from 'antd'
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

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4">
        {taskList.length > 0 ? (
          <div className="mt-4 space-y-2">
            {taskList.map(item => (
              <div
                key={item.id}
                className="group relative flex cursor-pointer items-center rounded-lg border border-gray-100 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 md:p-4"
                onClick={() => {
                  setCurrentTask(item)
                  setVisible(true)
                }}
              >
                <div
                  className="absolute top-1/2 left-3 -translate-y-1/2"
                  onClick={e => e.stopPropagation()} // Prevent parent click when clicking in this area
                >
                  <TaskSetting task={item} getTaskDetail={getTaskList}>
                    <div
                      className="mr-3 h-4 w-4 cursor-pointer rounded-sm border border-gray-200 bg-white opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={e => {
                        e.stopPropagation() // Extra protection
                      }}
                    />
                  </TaskSetting>
                </div>

                <div className="flex flex-1 flex-col pl-6 md:flex-row md:items-center md:space-x-3">
                  <div className="mb-1 md:mb-0">{renderStatus(item.status)}</div>
                  <div className="flex-1 truncate text-sm font-medium text-gray-800 md:text-base">
                    {item.name}
                  </div>
                </div>

                <Tooltip title={`截止时间: ${item.endTime}`} placement="top">
                  <div className="text-xs text-gray-500 md:text-sm">{item.diffTime}</div>
                </Tooltip>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">暂无任务</div>
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
