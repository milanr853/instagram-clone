import React from 'react'
import { useSelector } from 'react-redux'

import App from './App'

import ToAuthenticate from './ToAuthenticate'



function Wrapper() {
    const authenticated = useSelector(store => store.isAuthenticated.value)



    return (
        !authenticated ? <ToAuthenticate /> : <App />
    )
}

export default Wrapper