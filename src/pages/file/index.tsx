import { useEffect, useState } from 'react'
import FileHeader from './components/file-header.tsx'
import FileTable from './components/file-table.tsx'
import api from '@/api'
import { FileItem, LoginUser } from '@/api/type'

const File = () => {
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [fileList, setFileList] = useState<FileItem[]>([])

  const getFileList = (params?: { user_id?: string; name?: string; dirId?: number | null }) => {
    api.file.getFileList(params).then(res => {
      if (res.code === 200) {
        res.data.map(item => {
          item.checked = false
          item.hovered = false
        })
        setFileList(res.data)
      }
    })
  }

  const getUserFile = (params: { user_id: number }) => {
    api.user
      .findFile({
        id: params.user_id,
      })
      .then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            item.checked = false
            item.hovered = false
          })
          setFileList(res.data)
        }
      })
  }

  const changeMyFile = (val: boolean) => {
    if (val) {
      getUserFile({
        user_id: user.id,
      })
    } else {
      getFileList()
    }
  }

  useEffect(() => {
    getFileList()
  }, [])

  return (
    <div className="h-full w-full p-[30px]">
      <FileHeader getFileList={getFileList} />
      <FileTable fileList={fileList} changeMyFile={changeMyFile} />
    </div>
  )
}

export default File
