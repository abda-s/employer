import React from 'react'
import LoginForm from "../components/loginAndSignup/LoginForm";
import LoginPageLayout from '../components/loginAndSignup/LoginPageLayout';


function LoginPage() {
    return (
        <LoginPageLayout>
            <LoginForm />
        </LoginPageLayout>
    )
}

export default LoginPage