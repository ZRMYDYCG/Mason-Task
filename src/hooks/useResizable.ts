import { useState, useCallback, useEffect, useRef } from 'react'

type ResizableOptions = {
  minWidth: number
  maxWidth: number
  initialWidth?: number
}

const useResizable = ({ minWidth, maxWidth, initialWidth }: ResizableOptions) => {
  const [width, setWidth] = useState(initialWidth ?? minWidth)
  const [isDragging, setIsDragging] = useState(false)
  // 保存原始样式引用
  const originalUserSelectRef = useRef('')

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
    // 保存当前样式并禁用文本选择
    const bodyStyle = document.body.style
    originalUserSelectRef.current = bodyStyle.userSelect
    bodyStyle.userSelect = 'none'
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      // 计算并限制宽度范围
      const newWidth = Math.min(maxWidth, Math.max(minWidth, e.clientX))
      setWidth(newWidth)
    },
    [isDragging, minWidth, maxWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      // 清理时恢复原始样式
      if (isDragging) {
        const bodyStyle = document.body.style
        bodyStyle.userSelect = originalUserSelectRef.current
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    width,
    handleMouseDown,
    isDragging,
  }
}

export default useResizable
