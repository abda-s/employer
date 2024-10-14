import React from 'react'
import { Box } from '@mui/material'
import NavBar from '../../components/NavBar'
import ChoseSvg from "../../assetes/Businesswoman-receives-congratulation.svg"
import RoleSelectionForm from '../../components/roleSelection/RoleSelectionForm'
import '../../styles/ChoseRolepage.css'
function RoleSelectionPage() {
    return (
        <Box className='all-choose-container' >
            <Box sx={{ width: "100%", display: "flex" }} >
                <NavBar title="Chose Role" />
            </Box>
            <Box className="container">
                <Box className="container-choose-role">
                    <RoleSelectionForm />
                </Box>
                <Box className="container-choose-image">
                    <img src={ChoseSvg} style={{ width: "90%" }} alt="ChoseSvg" />
                </Box>
            </Box>
        </Box>
    )
}

export default RoleSelectionPage
