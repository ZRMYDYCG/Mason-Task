import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Popover, Tag, Modal, message } from 'antd'
import FullCalendar from '@fullcalendar/react'
import { EventContentArg, EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
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
        break
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
    return (
      <>
        <div className="mb-[10px] flex items-center text-base font-bold">
          <div className="text-[#606266]">
            {diff < 0 ? '[超期]' : ''} [{renderStatus(extendedProps.status)}]
          </div>
          <div className="ml-1">{extendedProps.name}</div>
        </div>
        <div className="mb-[10px] text-sm">
          {start} - {end}
        </div>
        <div className="flex items-center">
          <div>{renderLevel(extendedProps.level)}</div>
          {diff < 0 ? <Tag color="red">超期未完成</Tag> : null}
        </div>
        <div className="my-4 h-[1px] w-full bg-[#eee]"></div>
        <div className="flex items-center">
          <div
            className="flex flex-1 cursor-pointer items-center justify-center"
            style={{ borderRight: '1px solid #eee' }}
            onClick={() => handleUpdateTask(extendedProps)}
          >
            <div className="mr-2">
              <ProfileOutlined />
            </div>
            <div>详情</div>
          </div>
          <div
            className="flex flex-1 cursor-pointer items-center justify-center"
            onClick={() => deleteTask(extendedProps)}
          >
            <div className="mr-2">
              <DeleteOutlined />
            </div>
            <div>删除</div>
          </div>
        </div>
      </>
    )
  }

  const eventContent = (arg: EventContentArg) => {
    const el = document.createElement('div')
    const extendedProps = arg.event._def.extendedProps as TaskItem
    const end = dayjs(arg.event._instance?.range.end).format('YYYY-MM-DD HH:mm:ss')
    const diff = dayjs(end).diff(dayjs())
    const root = ReactDOM.createRoot(el)
    root.render(
      <Popover trigger="click" content={content(arg)} placement="left" key={extendedProps.id}>
        <div
          className="flex cursor-pointer px-[10px] py-[6px] font-bold"
          style={{
            background: diff >= 0 ? '#e3eafd' : '#fef0f0',
            color: diff >= 0 ? '#515a6e' : '#f56c6c',
            border: 'none',
          }}
        >
          <div>
            {diff < 0 ? '[超期]' : ''} [{renderStatus(extendedProps.status)}]
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
        plugins={[dayGridPlugin, interactionPlugin]}
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
        locale="Zh-cn"
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
