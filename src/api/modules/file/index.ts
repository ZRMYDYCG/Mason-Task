import { FileItem } from '../../type'
import { patch, post, postFormData } from '../../request'

export const getFileList = (params?: {
  user_id?: string
  name?: string
  dirId?: number | null
}) => {
  return post<FileItem[]>('/file', params)
}

export const upload = (params: { file: File; dirId: number | null }) => {
  return postFormData('/file/upload', params)
}

export const createDir = (params: { name: string }) => {
  return post<FileItem[]>('/file/createDir', params)
}

export const patchDelete = (params: { ids: number[] }) => {
  return post('/file/patchDelete', params)
}

export const updateFile = (id: number, params: Partial<FileItem>) => {
  return patch(`/file/${id}`, params)
}
