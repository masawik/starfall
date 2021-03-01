import React from 'react'
import {css, Global} from '@emotion/react'

const globalStyles = css`
            @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
            html,
            body {
            
              padding: 0;
              margin: 0;
              font-family: 'Roboto', sans-serif;
            }
            
            a {
              color: yellow;
              text-decoration: none;
            }
            
            * {
              box-sizing: border-box;
            }
          `

const MainLayout: React.FC = ({children}) => {
  return (
    <>
      <Global styles={globalStyles}/>
      {children}
    </>
  )
}

export default MainLayout