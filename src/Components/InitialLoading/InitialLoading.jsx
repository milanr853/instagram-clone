import React from 'react'
import loadingScreen from "../../Extra/grayLogo.png"


function InitialLoading() {
    return (
        <div className="PostContainer" style={{
            width: "600px",
            height: "calc(100vh - 150px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            background: "transparent",
        }}>
            <img style={{
                objectFit: "cover",
                width: "10%",
            }} src={loadingScreen} alt="loadingScreen" />
        </div>
    )
}

export default InitialLoading