import React from 'react'
import { Box } from '@mui/material'
import SavePdf from './SideBar/SavePdf'
import PresonalInfo from './SideBar/PresonalInfo'
import Education from './SideBar/Education'
import Experience from './SideBar/Experience'
import Skills from './SideBar/Skills'


function SideBarBuilder() {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, width: "100%", }} >

            <SavePdf />
            <PresonalInfo />
            <Education />
            <Skills />
            <Experience />
        </Box>
    )
}

export default SideBarBuilder
