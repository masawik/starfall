import React, {useCallback, useEffect, useState} from 'react'

type TTimerProps = {
  isPaused: boolean,
  isPlaying: boolean
}

const getFormattedTime = (s: number): string => {
  let min = Math.floor(s / 60) + ''
  let sec = s % 60 + ''
  if (min.length === 1) min = '0' + min
  if (sec.length === 1) sec = '0' + sec
  return `${min}:${sec}`
}

const Timer: React.FC<TTimerProps> = ({isPaused, isPlaying}) => {
  const [time, setTime] = useState(0)
  const [timerId, setTimerId] = useState<null | NodeJS.Timer>(null)

  const startTimer = useCallback(() => {
    const timerId = setInterval(() => {
      setTime(prevState => prevState + 1)
    }, 1000)
    setTimerId(timerId)
  }, [])

  const stopTimer = useCallback(() => {
    clearInterval(timerId)
    setTimerId(null)
  }, [timerId])

  useEffect(() => {
    if (isPlaying && !isPaused && !timerId) startTimer()
    if (isPlaying && isPaused) stopTimer()
    if (!isPlaying && !isPaused) {
      stopTimer()
      setTime(0)
    }
  }, [isPlaying, isPaused])

  return (
    <div>
      Время: {getFormattedTime(time)}
    </div>
  )
}

export default Timer