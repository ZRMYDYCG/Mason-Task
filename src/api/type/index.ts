import { JSX } from 'react'

export interface LoginUser {
  token: string
  user: {
    createAt: string
    email: string
    id: number
    nickname: string
    role: string
    updateAt: string
    username: string
    avatar: string
    bgColor?: string
  }
}

export interface FileItem {
  id: number
  name: string
  url: string
  ext: string
  user: LoginUser['user']
  isDir: boolean
  dirId: number
  size: number
  createAt: string
  updateAt: string
  checked: boolean
  hovered: boolean
}

export interface ProjectItem {
  id: number
  name: string
  createAt: string
  updateAt: string
  tasks: TaskItem[]
  myTasks?: TaskItem[]
  users: LoginUser['user'][]
  flag?: boolean
}

export interface TaskItem {
  createAt: string
  desc: string
  endTime: string
  id: number
  status: number
  name: string
  startTime: string
  updateAt: string
  level: string
  completed: boolean
  bgColor: string
  users: LoginUser['user'][]
  diffTime?: JSX.Element
}
