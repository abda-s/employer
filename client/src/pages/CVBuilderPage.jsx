import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { initCV } from '../redux'


import '../styles/CVBuilderPage.css'
import NavBar from "../components/NavBar"
import SideBarBuilder from "../components/CVBuilder/SideBarBuilder"
import CVCanvas from "../components/CVBuilder/CVCanvas"
import { serverURL } from '../constants'

function CVBuilderPage() {
  const accessToken = useSelector(state => state.auth.token)
  const cv = useSelector(state => state?.cv)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/auth/employee-data`, {
          headers: { accessToken }
          
        });

        const { userId, fullName, phoneNumber, professionalSummary, employeeSkills, education, experience } = response.data;

        dispatch(initCV(
          userId,
          fullName,
          phoneNumber,
          professionalSummary,
          employeeSkills,
          education,
          experience
        ));
      } catch (error) {
        console.error("Error fetching employee data", error);
      }
    };

    fetchData();
  }, [dispatch, accessToken]);



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