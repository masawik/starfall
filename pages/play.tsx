import React, {useCallback, useEffect, useState} from 'react'
import styled from '@emotion/styled'
import Star, {IStar} from '../components/Star'
import {random, uniqueId} from 'lodash'
import Timer from '../components/Timer'
import MainLayout from '../components/MainLayout'


const STARFALL_ZONE_WIDTH = 500
const MIN_STARS_COUNT = 5

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
    height: 600px;
    border: 1px solid red;
    overflow: hidden;
    position: relative;
  `
const ControlPanel = styled.div`
    padding: 20px 0;
    background-color: rgba(255,255,255, .4);
    display: flex;
    justify-content: space-around;
    color: #371548;
    font-size: 30px;
    font-weight: bold;
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

type TStarsState = Array<IStar>

const StartButton: React.FC<{ func: () => void }> = ({func}) => (
  <Button color={'#B7D333'} onClick={func}>
    <img src={'/assets/play.svg'} alt="старт"/>
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
        //todo убрать магические числа
        .map(() => {
          let value = 0
          while (!value) value = random(-5, 5)
          return {
            id: uniqueId('star_'),
            delay: random(100, 1000),
            startPos: {
              x: random(0, 350),
              y: random(-150, -800),
            },
            endPos: {
              x: random(0, 350),
              y: 600,
            },
            value: value
          }
        })
      setStars(prevState => [...prevState, ...newStarsState])
    }
  }, [isPlaying, stars])

  const onRestart = useCallback(() => {
    setStars([])
    setScoreCounter(0)
    setIsPlaying(false)
    setIsPaused(false)
  }, [])

  const deleteStar = useCallback((id: string) => {
    setStars(prevState => [...prevState.filter(i => i.id !== id)])
  }, [])

  const fallHandler = useCallback((id: string, value: number) => {
    deleteStar(id)
    setScoreCounter(prevState => prevState + value)
  }, [])

  const togglePause = useCallback(() => setIsPaused(prevState => !prevState), [])
  const onPlay = useCallback(() => setIsPlaying(true), [])

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
            {$stars}
          </StarContainer>

          <ControlPanel>
            <div>
              <div>Счет: {scoreCounter}</div>
              <Timer
                isPaused={isPaused}
                isPlaying={isPlaying}
              />
            </div>

            <div>
              {!isPlaying && <StartButton func={onPlay}/>}

              {isPlaying && !isPaused
              &&
              <Button color={'#FEE72B'} onClick={togglePause}>
                <img src={'/assets/pause.svg'} alt="пауза"/>
              </Button>}

              {isPlaying && isPaused && <StartButton func={togglePause}/>}

              {isPlaying
                &&
                <Button color={'#c93636'} onClick={onRestart}>
                  <img src={'/assets/reload.svg'} alt="рестарт"/>
                </Button>}

            </div>
          </ControlPanel>
        </ContentContainer>
      </MainContainer>
    </MainLayout>
  )
}

export default Play