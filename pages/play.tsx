import React, {useEffect, useState} from 'react'
import styled from '@emotion/styled'
import {Global} from '@emotion/react'
import {css} from '@emotion/react'
import Star, {IStar} from '../components/Star'
import {random, uniqueId} from 'lodash'
import Timer from '../components/Timer'

const Container = styled.div`
    height: 600px;
    width: 500px;
    border: 1px solid red;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  `
const globalStyles = css`
            html,
            body {
              padding: 0;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            }
            
            a {
              color: yellow;
              text-decoration: none;
            }
            
            * {
              box-sizing: border-box;
            }
          `

type TStarsState = Array<IStar>

const MIN_STARS_COUNT = 5

const Play: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false)
  const [stars, setStars] = useState<TStarsState>([])
  //todo сделать анимацию изменения счетчика и менять цвет в зависимости от значения
  const [scoreCounter, setScoreCounter] = useState<number>(0)

  useEffect(() => {
    if (stars.length < MIN_STARS_COUNT) {
      const newStarsState: TStarsState = new Array(MIN_STARS_COUNT - stars.length)
        .fill(null)
        //todo убрать магические числа
        .map(() => {
          let value = 0
          while (!value) value = random(-5, 5)
          return {
            id: uniqueId('star_'),
            delay: random(5000, 10000),
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
  }, [stars])

  const deleteStar = (id: string) => {
    setStars(prevState => [...prevState.filter(i => i.id !== id)])
  }

  const fallHandler = (id: string, value: number) => {
    deleteStar(id)
    setScoreCounter(prevState => prevState + value)
  }

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
    <>
      <Global styles={globalStyles}/>
      <Timer isPaused={isPaused}/>
      <span>Score: {scoreCounter}</span>
      <Container>
        <button onClick={() => setIsPaused(prevState => !prevState)}>pause</button>
        {$stars}
      </Container>
    </>
  )
}

export default Play