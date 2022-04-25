import React from 'react'

import "./options.css"

import { useSelector } from 'react-redux'



function AccountOptions() {

    const optionsVisibility = useSelector(store => store.accountOptionsVisibilityReducer.value)


    return (
        <>
            <div className="AccountOptionsHolder" style={{ display: optionsVisibility }}>
                <ul>
                    <li className='accountOption'><i className="bi bi-person"></i> Profile</li>
                    <li className='accountOption'><i className="bi bi-gear"></i> Settings</li>
                    <li className='accountOption'><i className="bi bi-box-arrow-right"></i> Logout</li>
                </ul>
            </div>
        </>
    )
}

export default AccountOptions