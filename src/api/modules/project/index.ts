import { ProjectItem } from '../../type'
import { get, post, patch } from '../../request'

export const getProjectList = () => {
  return get<ProjectItem[]>('/project/getList')
}

export const addProject = (params: { name: string }) => {
  return post('/project/create', params)
}

export const getProject = (id: number) => {
  return get<ProjectItem[]>(`/project/${id}`)
}

export const updateProject = (id: number, params: Partial<ProjectItem>) => {
  return patch(`/project/${id}`, params)
}
