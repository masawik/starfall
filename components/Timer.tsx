import React, {useEffect, useState} from 'react'

type TTimerProps = {
  isPaused: boolean,
  timerInterval?: number
}

const Timer: React.FC<TTimerProps> = ({isPaused, timerInterval = 1000}) => {
  const [time, setTime] = useState(0)
  const [timerId, setTimerId] = useState<null | NodeJS.Timer>(null)

  const startTimer = () => {
    const timerId = setInterval(() => {
      setTime(prevState => prevState + timerInterval)
    }, timerInterval)
    setTimerId(timerId)
  }

  const stopTimer = () => {
    if (timerId) clearInterval(timerId)
  }

  useEffect(() => {
    isPaused ? stopTimer() : startTimer()
  }, [isPaused])

  return (
    <span>таймер: {time}</span>
  )
}

export default Timer