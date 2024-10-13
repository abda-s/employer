import React from 'react'
import LoginForm from "../../components/loginAndSignup/LoginForm";
import LoginSignupLayout from '../../layout/LoginSignupLayout';
import LiveCollaboration from "../../assetes/Live-collaboration.svg"


function LoginPage() {
    return (
        <LoginSignupLayout imageSrc={LiveCollaboration} title="Login" >
            <LoginForm />
        </LoginSignupLayout>
    )
}

export default LoginPage