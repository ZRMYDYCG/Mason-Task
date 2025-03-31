import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '@/api'
import { FileItem, LoginUser } from '@/api/type'
import FileHeader from '@/pages/file/components/file-header.tsx'
import FileTable from '@/pages/file/components/file-table.tsx'

const Dir = () => {
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [searchParams] = useSearchParams()

  const getFileList = (params?: { user_id?: string; name?: string; dirId?: number | null }) => {
    const { dirId } = params as { user_id?: string; name?: string; dirId?: number | null }
    api.file
      .getFileList({
        dirId,
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
    const dirId = Number(searchParams.get('id') as string)
    getFileList({
      dirId,
    })
  }, [searchParams])

  return (
    <div className="h-full w-full p-[30px]">
      <FileHeader getFileList={getFileList} />
      <FileTable fileList={fileList} changeMyFile={changeMyFile} />
    </div>
  )
}

export default Dir
