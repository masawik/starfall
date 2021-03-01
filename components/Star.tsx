/** @jsxImportSource @emotion/react */
import React, {useEffect, useMemo, useState} from 'react'
import styled from '@emotion/styled'
import { jsx, css, keyframes } from '@emotion/react'
import {STAR_SIZE} from '../pages/play'

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
  onFinish: (id: string, value: number) => void,
  isPaused: boolean
}

const Star: React.FC<IStarProps> = ({value, delay, endPos, startPos, onFinish, id, isPaused}) => {
  const StarEL = useMemo(() => styled.div`
    height: ${STAR_SIZE}px;
    width: ${STAR_SIZE}px;
    background-image: url('/assets/star.png');
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: bold;
    position: absolute;
    top: -${STAR_SIZE}px;
`, [])
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const setTimer = () => {
    const timerId = setTimeout(() => onFinish(id, value), delay)
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
    transform: translate(${startPos.x}px, ${startPos.y + STAR_SIZE}px);
  }
  
  to {
    transform: translate(${endPos.x}px, ${endPos.y + STAR_SIZE}px);
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