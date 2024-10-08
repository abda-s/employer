import React from 'react'
import SignupForm from '../components/loginAndSignup/SignupForm'
import LoginSignupLayout from '../layout/LoginSignupLayout'
import sharedGols from "../assetes/Shared-goals.svg"

function SignupPage() {
    return (
        <LoginSignupLayout imageSrc={sharedGols} title="Sign up" >
            <SignupForm />
        </LoginSignupLayout>
        
    )
}

export default SignupPage