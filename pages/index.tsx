import React, {useEffect, useState} from 'react'
import styled from '@emotion/styled'
import {Global} from '@emotion/react'
import {css} from '@emotion/react'
import Star, {IStar} from '../components/Star'
import {random, uniqueId} from 'lodash'

const Container = styled.div`
    height: 600px;
    width: 500px;
    border: 1px solid red;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  `

type TStarsState = Array<IStar>

const MIN_STARS_COUNT = 5

const Home: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false)
  const [stars, setStars] = useState<TStarsState>([])

  useEffect(() => {
    if (stars.length < MIN_STARS_COUNT) {
      const newStarsState: TStarsState = new Array(MIN_STARS_COUNT - stars.length)
        .fill(null)
        //todo убрать магические числа
        .map(() => ({
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
          value: random(-5, 5)
        }))
      setStars(prevState => [...prevState, ...newStarsState])
    }
  }, [stars])

  const fallHandler = (id: string) => {
    setStars(prevState => [...prevState.filter(i => i.id !== id)])
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
  }
  )

  return (
    <>
      <Global styles={css`
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
          `}/>
      <Container>
        <button onClick={() => setIsPaused(prevState => !prevState)}>pause</button>
        {$stars}
      </Container>
    </>
  )
}

export default Home