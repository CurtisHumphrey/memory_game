import React from 'react'
import { Route } from 'react-router-dom'

import Home from 'views/Home'

export const createRoutes = () => {
  return (
    <Route path='/:game_id?' component={Home} />
  )
}

export default createRoutes
