import { get, post } from '../../request'
import { LoginUser, FileItem, TaskItem } from '../../type'

export const login = (params: { username: string; password: string }) => {
  return post<LoginUser>('/user/login', params)
}

export const register = (params: { username: string; password: string }) => {
  return post('/user/register', params)
}

export const userList = () => {
  return get<LoginUser['user'][]>('/user')
}

export const findTask = (params: { id: number }) => {
  return post<TaskItem[]>('/user/task', params)
}

export const findFile = (params: { id: number }) => {
  return post<FileItem[]>('/user/file', params)
}
