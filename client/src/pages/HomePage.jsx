import React from 'react'
import NavBar from './components/NavBar'
import { Box, Button, Typography } from '@mui/material'
import landingPageImage from '../assetes/landingPageImage.png'
import { useNavigate } from 'react-router-dom'

function HomePage() {
    const navigate = useNavigate()
    const features = [
        { title: "Create a CV", caption: "Build and customize your CV with our intuitive CV builder. Highlight your skills and experience to make a lasting impression." },
        { title: "Find Relevant Jobs", caption: "Get personalized job recommendations based on your CV data. Explore opportunities that match your qualifications and interests." },
        { title: "Track Applications", caption: "Easily track the jobs you've applied for and stay updated on their statuses." },
        { title: "Job Application Management", caption: "Employers can review and manage job applications, filter them based on status, and make informed hiring decisions." },
    ]

    return (
        <div style={{ width: "100%", height: "100vh", background: "#ffffff", }} >
            <NavBar title="Home" />

            <Box sx={{ display: "flex", width: "100vw", overflowY: "auto", height: "100%", padding: "80px", boxSizing: "border-box" }} >
                <Box sx={{ display: "flex", flex: 1 }}>

                    <Box sx={{ display: "flex", flexDirection: "column",mt:4 }} >
                        <Typography variant='h2' sx={{ fontWeight: 600 }} >
                            Jobs made easy
                        </Typography>
                        <Typography variant='h2' sx={{ fontWeight: 600 }} >
                            Worldwide
                        </Typography>

                        <Typography variant='body1' sx={{ marginTop: 3, maxWidth: '500px' }}>
                        Welcome to empolyer, your gateway to finding the perfect job or the ideal candidate. Our platform connects employers and employees with a user-friendly interface designed to streamline the job search and application process.
                        </Typography>

                        <Box sx={{ display: "flex", marginTop: 3, }} >

                            <Button variant="contained" size="large" onClick={()=>navigate('/signup')}>
                                Sign Up Now
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", marginTop: 3,fontSize:25,gap:3,color:"#6d7c92",alignItems:"center" }} >

                            <Typography variant='body2' color="secondary" sx={{color:"#6d7c92"}}>
                                Trusted by cornpanies
                            </Typography>

                            <i class="fa-brands fa-wix"></i>
                            <i class="fa-brands fa-waze"></i>
                            <i class="fa-brands fa-upwork"></i>
                            <i class="fa-brands fa-stripe"></i>
                            <i class="fa-brands fa-kickstarter"></i>
                        </Box>

                    </Box>

                </Box>
                <Box sx={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                    <img src={landingPageImage} style={{ width: "80%", height: "auto" }} alt="" />
                </Box>
            </Box>

        </div>
    )
}

export default HomePage
