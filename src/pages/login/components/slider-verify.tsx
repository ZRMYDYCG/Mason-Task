import React, { useState, useRef, useEffect } from 'react'

interface SliderVerifyProps {
  onVerifySuccess?: () => void
  onVerifyFail?: () => void
  disabled?: boolean
}

const SliderVerify: React.FC<SliderVerifyProps> = ({
  onVerifySuccess,
  onVerifyFail,
  disabled = false,
}) => {
  const [isVerified, setIsVerified] = useState(false)
  const [currentX, setCurrentX] = useState(0)
  const [knobWidth, setKnobWidth] = useState(40)
  const sliderRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)

  // 处理尺寸变化
  useEffect(() => {
    const slider = sliderRef.current
    const knob = knobRef.current
    if (!slider || !knob || disabled) return

    const observer = new ResizeObserver(() => {
      const sliderRect = slider.getBoundingClientRect()
      const newKnobWidth = knob.offsetWidth
      setKnobWidth(newKnobWidth)
      const maxX = sliderRect.width - newKnobWidth
      setCurrentX(prev => Math.min(prev, maxX))
    })

    observer.observe(slider)
    observer.observe(knob)

    return () => observer.disconnect()
  }, [disabled])

  // 拖动逻辑
  useEffect(() => {
    const knob = knobRef.current
    const slider = sliderRef.current
    if (!knob || !slider || disabled) return

    const handleMouseDown = (e: MouseEvent) => {
      if (isVerified) return
      isDragging.current = true
      startX.current = e.clientX - knob.getBoundingClientRect().left
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || isVerified) return
      const sliderRect = slider.getBoundingClientRect()
      const currentKnobWidth = knob.offsetWidth
      const maxX = sliderRect.width - currentKnobWidth

      let newX = e.clientX - sliderRect.left - startX.current
      newX = Math.max(0, Math.min(newX, maxX))
      setCurrentX(newX)

      if (newX >= maxX - 5) {
        setIsVerified(true)
        onVerifySuccess?.()
      }
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false

      if (!isVerified) {
        setCurrentX(0)
        onVerifyFail?.()
      }

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    knob.addEventListener('mousedown', handleMouseDown)
    return () => {
      knob.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isVerified, disabled, onVerifySuccess, onVerifyFail])

  return (
    <div className="mb-4 select-none">
      {!isVerified && <div className="mb-2 text-sm text-gray-500">请滑动完成验证</div>}

      <div
        ref={sliderRef}
        className={`relative h-10 w-full rounded-full bg-gray-100 ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} overflow-hidden transition-opacity`}
      >
        {/* 进度条 */}
        <div
          className={`absolute top-0 left-0 h-full ${isVerified ? 'bg-green-200' : 'bg-blue-200'} rounded-full transition-all duration-300`}
          style={{ width: currentX + knobWidth / 2 }}
        />

        {/* 滑块按钮 */}
        <div
          ref={knobRef}
          className={`absolute top-0 left-0 z-10 flex aspect-square h-full items-center justify-center text-white transition-all duration-300 ${isVerified ? 'bg-green-600' : 'bg-blue-600'} ${disabled ? 'cursor-not-allowed' : ''} `}
          style={{ left: currentX }}
        >
          {isVerified ? '✓' : '→'}
        </div>

        {/* 提示文字 */}
        <div className="absolute inset-0 z-0 flex items-center justify-center text-sm text-gray-600">
          {isVerified ? '验证通过' : '请向右滑动滑块'}
        </div>
      </div>
    </div>
  )
}

export default SliderVerify
