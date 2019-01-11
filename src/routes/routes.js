import React from 'react'
import { Route } from 'react-router-dom'

import Home from 'views/Home'

export const createRoutes = () => {
  return (
    <Route component={Home} />
  )
}

export default createRoutes
