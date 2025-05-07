import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Popover, Tag, Modal, message } from 'antd'
import FullCalendar from '@fullcalendar/react'
import { EventContentArg, EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { LoginUser, TaskItem } from '@/api/type'
import api from '@/api'
import dayjs from 'dayjs'
import { DeleteOutlined, ExclamationCircleFilled, ProfileOutlined } from '@ant-design/icons'
import UpdateTask from '@/pages/workbench/components/update-task.tsx'

const { confirm } = Modal

const Calendar = () => {
  const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']
  const [events, setEvents] = useState<EventInput[]>([])
  const [visible, setVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskItem>()

  const getTaskList = () => {
    api.user
      .findTask({
        id: user.id,
      })
      .then(res => {
        const events = res.data.map(item => ({
          title: item.name,
          start: item.startTime,
          end: item.endTime,
          extendedProps: {
            ...item,
            taskId: item.id,
          },
        }))
        setEvents(events)
      })
  }

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return '待处理'
      case 1:
        return '进行中'
      case 2:
        return '待测试'
      case 3:
        return '已完成'
      case 4:
        return '已取消'
      default:
        return '未知状态'
    }
  }

  const renderLevel = (level: string) => {
    if (level === 'P1') {
      return <Tag color="red">{level}</Tag>
    }
    if (level === 'P2') {
      return <Tag color="blue">{level}</Tag>
    }
    if (level === 'P3') {
      return <Tag color="cyan">{level}</Tag>
    }
    return null
  }

  const handleUpdateTask = (extendedProps: TaskItem) => {
    setCurrentTask(extendedProps)
    setVisible(true)
  }

  const deleteTask = (extendedProps: TaskItem) => {
    confirm({
      title: '删除任务',
      icon: <ExclamationCircleFilled />,
      content: `您确定要删除任务 [${extendedProps.name}] 吗?`,
      okType: 'danger',
      onOk() {
        api.task.deleteTask(extendedProps.id).then(res => {
          if (res.code === 200) {
            message.success(res.msg)
            getTaskList()
          } else {
            message.error(res.msg)
          }
        })
      },
      onCancel() {
        message.info('已取消删除')
      },
    })
  }

  const content = (arg: EventContentArg) => {
    const extendedProps = arg.event._def.extendedProps as TaskItem
    const start = dayjs(arg.event._instance?.range.start).format('YYYY-MM-DD HH:mm:ss')
    const end = dayjs(arg.event._instance?.range.end).format('YYYY-MM-DD HH:mm:ss')
    const diff = dayjs(end).diff(dayjs())
    const statusColor = () => {
      switch (extendedProps.status) {
        case 0:
          return 'bg-yellow-200'
        case 1:
          return 'bg-blue-200'
        case 2:
          return 'bg-green-200'
        case 3:
          return 'bg-green-400'
        case 4:
          return 'bg-gray-200'
        default:
          return 'bg-gray-300'
      }
    }

    return (
      <div className={`rounded-lg p-4 shadow-md ${statusColor()}`}>
        <div className="mb-2 flex items-center text-lg font-semibold">
          <div className="text-sm text-gray-600">
            {diff < 0 ? <span className="text-red-600">[超期]</span> : ''} [
            {renderStatus(extendedProps.status)}]
          </div>
          <div className="ml-2">{extendedProps.name}</div>
        </div>
        <div className="mb-2 text-sm text-gray-600">
          {start} - {end}
        </div>
        <div className="mb-2 flex items-center">
          <div>{renderLevel(extendedProps.level)}</div>
          {diff < 0 && <Tag color="red">超期未完成</Tag>}
        </div>
        <div className="mt-4 mb-2 text-sm text-gray-600">{extendedProps.desc}</div>
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer items-center"
            onClick={() => handleUpdateTask(extendedProps)}
          >
            <ProfileOutlined className="mr-2 text-gray-600" />
            <span>详情</span>
          </div>
          <div
            className="flex cursor-pointer items-center"
            onClick={() => deleteTask(extendedProps)}
          >
            <DeleteOutlined className="mr-2 text-red-600" />
            <span>删除</span>
          </div>
        </div>
      </div>
    )
  }

  const eventContent = (arg: EventContentArg) => {
    const el = document.createElement('div')
    const extendedProps = arg.event._def.extendedProps as TaskItem
    const end = dayjs(arg.event._instance?.range.end).format('YYYY-MM-DD HH:mm:ss')
    const diff = dayjs(end).diff(dayjs())
    const statusColor = () => {
      switch (extendedProps.status) {
        case 0:
          return 'bg-yellow-100 text-yellow-600'
        case 1:
          return 'bg-blue-100 text-blue-600'
        case 2:
          return 'bg-green-100 text-green-600'
        case 3:
          return 'bg-green-200 text-green-800'
        case 4:
          return 'bg-gray-100 text-gray-600'
        default:
          return 'bg-gray-200 text-gray-600'
      }
    }

    const root = ReactDOM.createRoot(el)

    root.render(
      <Popover trigger="click" content={content(arg)} placement="left" key={extendedProps.id}>
        <div className={`flex cursor-pointer rounded-lg px-2 py-1 font-semibold ${statusColor()}`}>
          <div>
            {diff < 0 ? <span className="text-red-600">[超期]</span> : ''} [
            {renderStatus(extendedProps.status)}]
          </div>
          <div className="ml-1">{extendedProps.name}</div>
        </div>
      </Popover>
    )
    return {
      domNodes: [el],
      progressiveEventRendering: true,
    }
  }

  useEffect(() => {
    getTaskList()
  }, [])

  return (
    <div className="h-full w-full overflow-auto p-5">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
        themeSystem="bootstrap5"
        headerToolbar={{
          left: 'title prev,next today',
          center: '',
          right: 'dayGridDay,dayGridWeek,dayGridMonth',
        }}
        buttonText={{
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
        }}
        locale="zh-cn"
        events={events}
        eventContent={eventContent}
      />
      <UpdateTask
        task={currentTask as TaskItem}
        visible={visible}
        setVisible={setVisible}
        getTaskDetail={getTaskList}
      />
    </div>
  )
}

export default Calendar
