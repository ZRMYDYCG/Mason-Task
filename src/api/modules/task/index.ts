import { TaskItem } from '../../type'
import { patch, post, remove } from '../../request'

export const getTaskList = () => {
  return post<TaskItem[]>('/task/list')
}

export const getTaskDetail = (params: {
  projectId: number
  userId: number
  current: number
  size: number
  keyword: string
}) => {
  return post<TaskItem[]>('/task/detail', params)
}

export const addTask = (params: Partial<TaskItem>) => {
  return post('/task', params)
}

export const updateTask = (id: number, params: Partial<TaskItem>) => {
  return patch(`/task/${id}`, params)
}

export const deleteTask = (id: number) => {
  return remove(`/task/${id}`)
}
