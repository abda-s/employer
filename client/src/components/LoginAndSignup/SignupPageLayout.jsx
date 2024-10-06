import React from 'react'
import sharedGols from "../../assetes/Shared-goals.svg"
import { Typography } from '@mui/material'
import '../../styles/SignupPage.css'


function SignupPageLayout({ children }) {
    return (
        <div className='container'>

            <div className='container-flex-1'>

                <div className='signup-con' >
                    <Typography variant="h5" component="div" >
                        Sign up
                    </Typography>
                    {children}
                </div>

            </div>

            <div className='signup-image-con'>
                <img src={sharedGols} style={{ width: "90%" }} alt="sharedGols" />
            </div>

        </div>
    )
}

export default SignupPageLayout