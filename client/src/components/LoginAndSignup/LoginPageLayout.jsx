import React from 'react'
import LiveCollaboration from "../../assetes/Live-collaboration.svg"
import '../../styles/loginPage.css'

function LoginPageLayout({ children }) {
    return (
        <div>
            {/* <NavBar title="LOGIN" /> */}
            <div className='container' >

                <div className='login-form-container' >
                    {children}
                </div>

                <div className='login-image-container' >
                    <img src={LiveCollaboration} width="80%" alt="LiveCollaboration" />
                </div>

            </div>
        </div>
    )
}

export default LoginPageLayout