import React from 'react'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Progress, message } from 'antd'
import api from '@/api'
import { ProjectItem } from '@/api/type'

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
    e.preventDefault()
    item.flag = !item.flag
    setProjectList([...projectList])
  }

  const setCurrentProject = (val: number) => {
    setCurrent(val)
  }

  const onOk = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue()
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
          .catch(() => {
            onCancel()
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }

  const onCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  useEffect(() => {
    if (!projectList.length) {
      getProjectList()
    }
  }, [])

  useEffect(() => {
    const id = searchParams.get('id') as string
    const name = searchParams.get('name') as string
    projectList.map(item => {
      if (item.id === +id) {
        item.name = name
      }
    })
    setProjectList([...projectList])
    setCurrent(+id)
  }, [searchParams])

  useImperativeHandle(ref, () => ({
    setCurrentProject,
  }))

  return (
    <div className="mt-7">
      <Button
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        style={{ width: 260, marginBottom: 10 }}
        onClick={() => setVisible(true)}
      >
        新建项目
      </Button>
      {projectList.length
        ? projectList.map(item => {
            return (
              <div key={item.id}>
                <div
                  className="relative mb-3 flex cursor-pointer items-center px-1 py-2"
                  style={{ background: current === item.id ? '#fff' : 'inherit' }}
                >
                  <div className="flex items-center" onClick={e => clickProject(e, item)}>
                    <CaretRightOutlined style={{ color: '#999' }} />
                  </div>
                  <div className="ml-2" onClick={() => clickItem(item)}>
                    {item.name}
                  </div>
                  <div className="absolute right-3">
                    {item.tasks.length ? item.tasks.length : null}
                  </div>
                </div>
                {item.flag ? (
                  <div className="ml-7 text-xs">
                    <div className="mb-4 flex items-center">
                      <div>全部:</div>
                      <div className="ml-1">
                        {item.tasks.filter(i => i.status === 4).length}/{item.tasks.length}
                      </div>
                      <div className="relative top-[3px] left-1 flex-1">
                        <Progress
                          percent={
                            item.tasks.filter(i => i.status === 4).length / item.tasks.length
                          }
                        ></Progress>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })
        : null}
      <Modal
        open={visible}
        title="新建项目"
        okText="添加"
        maskClosable={false}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form form={form}>
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '项目名称不能为空' }]}
          >
            <Input placeholder="请输入项目名称" allowClear autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})

export default ProjectList
