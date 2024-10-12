import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initCV } from '../../redux'

import '../../styles/CVBuilderPage.css'
import NavBar from "../../components/NavBar"
import SideBarBuilder from "../../components/cvBuilder/SideBarBuilder"
import CVCanvas from "../../components/cvBuilder/CVCanvas"
import { useAxios } from '../../hooks/useAxios'

function CVBuilderPage() {
  const cv = useSelector(state => state?.cv)
  const dispatch = useDispatch()

  const { response, error } = useAxios({
    url: `/auth/employee-data`,
    method: 'GET',
  })

  useEffect(() => {
    if (response && (!response.error || error)) {

      const { userId,
        fullName,
        phoneNumber,
        professionalSummary,
        employeeSkills,
        education,
        experience
      } = response;

      dispatch(initCV(
        userId,
        fullName,
        phoneNumber,
        professionalSummary,
        employeeSkills,
        education,
        experience
      ));
    }

  }, [dispatch, response]);



  return (
    <div style={{ background: "#f0eeeb" }}>
      <NavBar title="CV Builder" />
      <div className="container-cv-builder">

        <div className="container-flex-1-cv">
          <SideBarBuilder />
        </div>

        <div className="container-flex-2-cv">
          <CVCanvas
            cv={cv}
          />
        </div>

      </div>
    </div>
  )
}

export default CVBuilderPage