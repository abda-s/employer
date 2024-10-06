import React from 'react'
import LoginForm from "../components/LoginAndSignup/LoginForm";
import LoginPageLayout from '../components/LoginAndSignup/LoginPageLayout';


function LoginPage() {
    return (
        <LoginPageLayout>
            <LoginForm />
        </LoginPageLayout>
    )
}

export default LoginPage