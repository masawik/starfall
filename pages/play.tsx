import React, {useCallback, useEffect, useState} from 'react'
import styled from '@emotion/styled'
import Star, {IStar} from '../components/Star'
import {random, uniqueId} from 'lodash'
import Timer from '../components/Timer'
import MainLayout from '../components/MainLayout'

const STARFALL_ZONE_WIDTH = 500
const STARFALL_ZONE_HEIGHT = 600
const MIN_STARS_COUNT = 3
const STAR_FALLING_MIN_DELAY = 2000
const STAR_FALLING_MAX_DELAY = 6000
const STAR_MIN_VALUE = -5
const STAR_MAX_VALUE = 5
export const STAR_SIZE = 150

const MainContainer = styled.div`
  margin: 0 auto;
  background-image: url('/assets/background.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  max-width: 1010px;
`
const ContentContainer = styled.div`
  width: ${STARFALL_ZONE_WIDTH}px;
`
const StarContainer = styled.div`
    height: ${STARFALL_ZONE_HEIGHT}px;
    overflow: hidden;
    position: relative;
  `
const ControlPanel = styled.div`
    padding: 20px 0;
    background-color: rgba(255,255,255, .4);
    display: flex;
    justify-content: space-around;
`
const Button = styled.button`
  padding: 15px 20px;
  background-color: ${props => props.color};
  font-size: 30px;
  font-weight: bold;
  border-radius: 15px;
  box-shadow: 0px 2px #000;
  outline: none;
  border: 1px solid transparent;
  
  &:focus {
    border: 1px solid #fff;
  }
  
  &:active {
    box-shadow: none;
    transform: translateY(2px);
  }
  
  img {
    width: 40px;
    height: 40px;
  }
  
  &:not(:last-child) {
    margin-right: 5px;
  }
`
const StatBox = styled.div`
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    text-align: end;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
`

type TStarsState = Array<IStar>

const StartButton: React.FC<{ func: () => void }> = ({func}) => (
  <Button color={'#B7D333'} onClick={func}>
    старт
  </Button>
)

const Play: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [scoreCounter, setScoreCounter] = useState<number>(0)
  const [stars, setStars] = useState<TStarsState>([])

  useEffect(() => {
    if (isPlaying && stars.length < MIN_STARS_COUNT) {
      const newStarsState: TStarsState = new Array(MIN_STARS_COUNT - stars.length)
        .fill(null)
        .map(() => {
          let value = 0
          while (!value) value = random(STAR_MIN_VALUE, STAR_MAX_VALUE)
          return {
            id: uniqueId('star_'),
            delay: random(STAR_FALLING_MIN_DELAY, STAR_FALLING_MAX_DELAY),
            startPos: {
              x: random(0, STARFALL_ZONE_WIDTH - STAR_SIZE),
              y: random(-STAR_SIZE, -STARFALL_ZONE_HEIGHT),
            },
            endPos: {
              x: random(0, STARFALL_ZONE_WIDTH - STAR_SIZE),
              y: STARFALL_ZONE_HEIGHT,
            },
            value: value
          }
        })
      setStars(prevState => [...prevState, ...newStarsState])
    }
  }, [isPlaying, stars])

  const onRestart = useCallback(() => {
    setStars([])
    setIsPlaying(false)
    setIsPaused(false)
    setScoreCounter(0)
  }, [])

  const deleteStar = useCallback((id: string) => {
    setStars(prevState => [...prevState.filter(i => i.id !== id)])
  }, [])

  const fallHandler = useCallback((id: string, value: number) => {
    deleteStar(id)
    setScoreCounter(prevState => prevState + value)
  }, [])

  const togglePause = useCallback(() => setIsPaused(prevState => !prevState), [])
  const onPlay = useCallback(() => {
    setScoreCounter(0)
    setIsPlaying(true)
  }, [])

  const $stars = stars.map(i => {
    if (!i) return
    const {value, endPos, startPos, delay, id} = i
    return (
      <Star
        id={id}
        key={id}
        value={value}
        onFinish={fallHandler}
        delay={delay}
        startPos={startPos}
        endPos={endPos}
        isPaused={isPaused}
      />
    )
  })

  return (
    <MainLayout>
      <MainContainer>
        <ContentContainer>
          <StarContainer>
            <StatBox>
              <div>Счет: {scoreCounter}</div>
              <Timer
                isPaused={isPaused}
                isPlaying={isPlaying}
              />
            </StatBox>
            {$stars}
          </StarContainer>

          <ControlPanel>
            <div>
              {!isPlaying && <StartButton func={onPlay}/>}

              {isPlaying && !isPaused
              &&
              <Button color={'#FEE72B'} onClick={togglePause}>
                Пауза
              </Button>}

              {isPlaying && isPaused && <StartButton func={togglePause}/>}

              {isPlaying
              &&
              <Button color={'#c93636'} onClick={onRestart}>
                рестарт
              </Button>}
            </div>
          </ControlPanel>
        </ContentContainer>
      </MainContainer>
    </MainLayout>
  )
}

export default Play