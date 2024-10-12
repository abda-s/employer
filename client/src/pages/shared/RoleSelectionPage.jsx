import React from 'react'
import NavBar from '../../components/NavBar'
import ChoseSvg from "../../assetes/Businesswoman-receives-congratulation.svg"
import ChooseForm from '../../components/chooseRole/ChooseForm'
import '../../styles/ChoseRolepage.css'
function RoleSelectionPage() {
    return (
        <div className='all-choose-container' >
            <div style={{ width: "100%", display: "flex" }} >
                <NavBar title="Chose Role" />
            </div>
            <div className="container">
                <div className="container-choose-role">
                    <ChooseForm />
                </div>
                <div className="container-choose-image">
                    <img src={ChoseSvg} style={{ width: "90%" }} alt="ChoseSvg" />
                </div>
            </div>
        </div>
    )
}

export default RoleSelectionPage