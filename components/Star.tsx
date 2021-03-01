/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react'
import styled from '@emotion/styled'
import { jsx, css, keyframes } from '@emotion/react'

const TOP_OFFSET = -200

const StarEL = styled.div`
  height: 150px;
  width: 150px;
  background-image: url('/assets/star.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  font-weight: bold;
  position: absolute;
  top: ${TOP_OFFSET}px;
`

export type TStarPosition = {
  x: number,
  y: number
}

export interface IStar {
  id: string,
  startPos: TStarPosition,
  endPos: TStarPosition,
  delay: number,
  value: number
}

interface IStarProps extends IStar {
  onFinish: (id: string) => void,
  isPaused: boolean
}

const Star: React.FC<IStarProps> = ({value, delay, endPos, startPos, onFinish, id, isPaused}) => {
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)


  const setTimer = () => {
    const timerId = setTimeout(() => onFinish(id), delay)
    setTimerId(timerId)
  }

  useEffect(setTimer, [])

  useEffect(() => {
    if (timerId) {
      if (isPaused) clearTimeout(timerId)
      else setTimer()
    }
  }, [isPaused])

  const fallingAnimation = keyframes`
  from {
    transform: translate(${startPos.x}px, ${startPos.y - TOP_OFFSET}px);
  }
  
  to {
    transform: translate(${endPos.x}px, ${endPos.y - TOP_OFFSET}px);
  }
`

  return (
    <StarEL
      css={css`
        animation: ${fallingAnimation} ${delay}ms ease-in 1;
        animation-play-state: ${isPaused ? 'paused' : 'running'};
      `}
    >
      {value}
    </StarEL>
  )
}

export default Star