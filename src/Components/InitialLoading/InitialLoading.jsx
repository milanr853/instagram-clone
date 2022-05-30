import React from 'react'
import loadingScreen from "../../Extra/grayLogo.png"


function InitialLoading() {
    return (
        <div className="PostContainer" style={{
            width: "600px",
            height: "calc(100vh - 150px )",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            background: "transparent",
            // background: "black"
        }}>
            <img style={{
                objectFit: "cover",
                width: "8.5%",
            }} src={loadingScreen} alt="loadingScreen" />
        </div>
    )
}

export default InitialLoading