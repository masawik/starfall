import React, {useEffect} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'

const Home: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/play')
  }, [])

  return (
    <>
      Если игра не открылась автоматически, нажимте
      <Link href={'/play'}>
        <a>Сюда</a>
      </Link>
    </>
  )
}

export default Home