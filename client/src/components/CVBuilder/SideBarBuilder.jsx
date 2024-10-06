import React from 'react'
import SavePdf from './SideBar/SavePdf'
import PresonalInfo from './SideBar/PresonalInfo'
import Education from './SideBar/Education'
import Experience from './SideBar/Experience'
import Skills from './SideBar/Skills'


function SideBarBuilder() {


    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%", }} >

            <SavePdf />
            <PresonalInfo />
            <Education />
            <Skills />
            <Experience />
        </div>
    )
}

export default SideBarBuilder