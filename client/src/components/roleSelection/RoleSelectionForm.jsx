import React, { useState } from 'react'
import { Button } from '@mui/material'
import EmployerForm from './EmployerForm'
import EmployeeForm from './EmployeeForm'



function ChooseForm() {
    const [isEmployee, setIsEmployee] = useState(true)
    return (
        <div className={isEmployee ? "choose-form-con-employee" : "choose-form-con-employer"} >
            <div style={{ width: "100%", justifyContent: "space-around", display: "flex", marginTop: "24px" }}>
                <Button
                    variant="contained"
                    color={isEmployee ? "primary" : "secondary"}
                    size='large'
                    sx={{
                        width: "45%"
                    }}
                    onClick={() => {
                        setIsEmployee(true)
                    }}
                >
                    Employee
                </Button>
                <Button
                    variant="contained"
                    color={!isEmployee ? "primary" : "secondary"}
                    size='large'
                    onClick={() => {
                        setIsEmployee(false)
                    }}
                    sx={{
                        width: "45%"
                    }}
                >
                    Employer
                </Button>
            </div>

            <div style={{ display: "flex", width: "100%" }}>
                {isEmployee ? <EmployeeForm /> : <EmployerForm />}
            </div>

        </div>
    )
}

export default ChooseForm