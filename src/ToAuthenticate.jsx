import React from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from './Components/Login/LoginPage'
import SignUp from './Components/SignUp/SignUp'




function ToAuthenticate() {
    return (
        <Router>
            <Routes>
                <Route path='/signup' element={<SignUp />} />
                <Route path='*' element={<LoginPage />} />
            </Routes>
        </Router>
    )
}

export default ToAuthenticate