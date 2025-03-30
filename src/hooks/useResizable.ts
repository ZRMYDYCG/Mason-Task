import { useState, useCallback, useEffect } from 'react'

type ResizableOptions = {
  minWidth: number
  maxWidth: number
  initialWidth?: number
}

const useResizable = ({ minWidth, maxWidth, initialWidth }: ResizableOptions) => {
  const [width, setWidth] = useState(initialWidth ?? minWidth)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

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
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    width,
    handleMouseDown,
    isDragging,
  }
}

export default useResizable
