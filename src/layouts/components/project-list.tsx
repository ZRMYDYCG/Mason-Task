import React from 'react'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Progress, message } from 'antd'
import api from '@/api'
import { ProjectItem } from '@/api/type'
import clsx from 'clsx'

interface Props {
  setPath: (val: string) => void
}

const ProjectList = forwardRef((props: Props, ref) => {
  const { setPath } = props
  const user = JSON.parse(localStorage.getItem('task-user') as string)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [projectList, setProjectList] = useState<ProjectItem[]>([])
  const [current, setCurrent] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const getProjectList = () => {
    api.project.getProjectList().then(res => {
      res.data.map(item => {
        item.flag = false
        item.myTasks = item.tasks.filter(i => i.users.map(u => u.id).includes(user.id))
      })
      setProjectList(res.data)
    })
  }

  const clickItem = (item: ProjectItem) => {
    setPath('')
    setCurrent(item.id)
    navigate(`/project?id=${item.id}&name=${item.name}`)
  }

  const clickProject = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ProjectItem) => {
    e.stopPropagation()
    item.flag = !item.flag
    setProjectList([...projectList])
  }

  const setCurrentProject = (val: number) => {
    setCurrent(val)
  }

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        api.project
          .addProject(values)
          .then(res => {
            if (res.code === 200) {
              message.success(res.msg)
              getProjectList()
              onCancel()
            } else {
              message.error(res.msg)
            }
          })
          .catch(onCancel)
      })
      .catch(() => message.error('表单填写有误,请检查'))
  }

  const onCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  useEffect(() => {
    !projectList.length && getProjectList()
  }, [])

  useEffect(() => {
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    if (id && name) {
      setProjectList(prev => prev.map(item => (item.id === +id ? { ...item, name } : item)))
      setCurrent(+id)
    }
  }, [searchParams])

  useImperativeHandle(ref, () => ({
    setCurrentProject,
  }))

  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-sm font-medium text-gray-500">我的项目</span>
        <PlusOutlined
          className="cursor-pointer text-gray-400 transition-colors hover:scale-110 hover:text-blue-500"
          onClick={() => setVisible(true)}
        />
      </div>

      <div className={clsx('custom-scrollbar max-h-[calc(100vh-380px)] overflow-y-auto pr-2')}>
        {projectList.map(item => (
          <div key={item.id} className="group mb-1">
            <div
              className={clsx(
                'flex h-10 items-center rounded-lg px-2 transition-all',
                'cursor-pointer hover:bg-white hover:shadow-sm',
                current === item.id
                  ? 'scale-[1.02] transform bg-white shadow-sm'
                  : 'hover:-translate-x-1'
              )}
              onClick={() => clickItem(item)}
            >
              <div
                className="flex items-center pr-2 text-gray-400 transition-colors hover:text-blue-500"
                onClick={e => clickProject(e, item)}
              >
                <CaretRightOutlined
                  className={clsx(
                    'transition-transform duration-300',
                    item.flag ? 'rotate-90' : ''
                  )}
                />
              </div>
              <div className="flex-1 truncate text-sm text-gray-700">{item.name}</div>
              <div className="ml-2 text-xs text-gray-400">{item.tasks.length || ''}</div>
            </div>

            {item.flag && (
              <div className="mt-1 ml-6 space-y-2 border-l-2 border-gray-100 pb-2 pl-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <span className="text-nowrap">进度:</span>
                    <span className="font-medium">
                      {item.tasks.filter(i => i.status === 4).length}/{item.tasks.length}
                    </span>
                  </div>
                  <Progress
                    percent={
                      (item.tasks.filter(i => i.status === 4).length / (item.tasks.length || 1)) *
                      100
                    }
                    showInfo={false}
                    strokeColor="#3b82f6"
                    className="w-16"
                    strokeWidth={6}
                    trailColor="#e5e7eb"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={visible}
        title="新建项目"
        okText="创建"
        maskClosable={false}
        onOk={onOk}
        onCancel={onCancel}
        destroyOnClose
        className="rounded-lg"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input
              placeholder="例如: 产品迭代计划"
              allowClear
              autoComplete="off"
              className="rounded-lg hover:border-blue-300 focus:border-blue-500"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})

export default ProjectList
