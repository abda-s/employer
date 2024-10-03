import React from 'react'
import NavBar from './components/NavBar'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import landingPageImage from '../assetes/landingPageImage.png'
import { useNavigate } from 'react-router-dom'
import HomepageNavBar from './components/HomepageNavBar'

function HomePage() {
    const navigate = useNavigate()
    const isMobile = useMediaQuery('(max-width:600px)')
    const features = [
        { title: "Create a CV", caption: "Build and customize your CV with our intuitive CV builder. Highlight your skills and experience to make a lasting impression." },
        { title: "Find Relevant Jobs", caption: "Get personalized job recommendations based on your CV data. Explore opportunities that match your qualifications and interests." },
        { title: "Track Applications", caption: "Easily track the jobs you've applied for and stay updated on their statuses." },
        { title: "Job Application Management", caption: "Employers can review and manage job applications, filter them based on status, and make informed hiring decisions." },
    ]

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#ffffff", boxSizing: "border-box" }} >

                <HomepageNavBar />

            <Box sx={{ display: "flex", width: "100vw", overflowY: "auto", height: "100%", padding: isMobile ? "30px" : "80px", boxSizing: "border-box" }} >
                <Box sx={{ display: "flex", flex: 1 }}>

                    <Box sx={{ display: "flex", flexDirection: "column", mt: isMobile ? 2 : 4 }} >
                        <Typography variant='h2' sx={{ fontWeight: 600, textAlign: "left" }} >
                            Jobs made easy
                        </Typography>
                        <Typography variant='h2' sx={{ fontWeight: 600, textAlign: "left" }} >
                            Worldwide
                        </Typography>

                        <Typography variant='body1' sx={{ marginTop: 3, maxWidth: isMobile ? "100%" : "500px", textAlign: "left" }}>
                            Welcome to empolyer, your gateway to finding the perfect job or the ideal candidate. Our platform connects employers and employees with a user-friendly interface designed to streamline the job search and application process.
                        </Typography>

                        <Box sx={{ display: "flex", marginTop: 3, justifyContent: "flex-start" }} >

                            <Button variant="contained" size="large" onClick={() => navigate('/signup')}>
                                Sign Up Now
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", marginTop: 3, fontSize: 25, gap: 3, color: "#6d7c92", alignItems: "center", justifyContent: "flex-start" }} >

                            <Typography variant='body2' color="secondary" sx={{ color: "#6d7c92" }}>
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
                <Box sx={{ display: isMobile ? "none" : "flex", flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                    <img src={landingPageImage} style={{ width: isMobile ? "100%" : "80%", height: "auto" }} alt="" />
                </Box>
            </Box>




            <Box sx={{ display: "flex", width: "100vw", height: "100%", padding: isMobile ? "20px" : "80px", boxSizing: "border-box" }} >

                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", boxSizing: "border-box" }} >
                    <Typography variant='h2' sx={{ fontWeight: 600, textAlign: isMobile ? "center" : "left" }} >
                        Features
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3, width: "100%", mt: 4 }} >
                        {features.map((feature, index) => (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", border: "1px solid #e5e5e5", borderRadius: 2, p: 2 }} key={index} >
                                {index === 0 && <i className="fas fa-search" style={{ fontSize: 120, marginTop: 3 }} ></i>}
                                {index === 1 && <i className="fas fa-user-tie" style={{ fontSize: 120, marginTop: 3 }} ></i>}
                                {index === 2 && <i className="fas fa-briefcase" style={{ fontSize: 120, marginTop: 3 }} ></i>}
                                {index === 3 && <i className="fas fa-file-contract" style={{ fontSize: 120, marginTop: 3 }} ></i>}
                                <Box>
                                    <Typography variant='h5' sx={{ fontWeight: 600, textAlign: { xs: "center", sm: "left" } }} >
                                        {feature.title}
                                    </Typography>
                                    <Typography variant='body2' sx={{ mt: 1, textAlign: { xs: "center", sm: "left" } }} >
                                        {feature.caption}
                                    </Typography>
                                </Box>

                            </Box>
                        ))}
                    </Box>
                </Box>



            </Box>

        </div>
    )
}

export default HomePage

