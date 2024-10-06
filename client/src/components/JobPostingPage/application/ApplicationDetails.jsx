import React, { useEffect, useState } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button, IconButton } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import CVCanvas from '../../CVBuilder/CVCanvas';
import { serverURL } from '../../../constants';

function ApplicationDetails({ item, status, setStatus, data, setData, cv }) {
    const token = useSelector(state => state.auth.token);

    const [isCV, setIsCV] = useState(false)
    const [isMobile, setIsMobile] = useState(false);

    const handleChange = (event) => {
        const newStatus = event.target.value;
        // Make a request to the server when the status changes
        axios.put(`${serverURL}/application/change-status`, { status: newStatus, applicationId: item._id }, { headers: { accessToken: token } })
            .then(response => {
                // console.log('Status updated:', response.data);

                const applicationIndex = data.applications.findIndex(app => app._id === item._id)

                const newApplication = data.applications[applicationIndex]
                newApplication.status = newStatus

                const newData = data
                newData.applications[applicationIndex] = newApplication

                setStatus(newStatus)
                setData(newData)

            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
        };

        handleResize(); // Check on initial load
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handlePrint = useReactToPrint({
        content: () => document.getElementById('cv-canvas'),
        documentTitle: `${cv.fullName} cv`,
    });

    return !isCV ? (
        <div style={{ display: "flex", borderRadius: "10px", boxShadow: "2px 2px 2px 1px rgb(0 0 0 / 20%)", flexDirection: "column", background: "white", width: "500px", padding: "20px", alignSelf: "center" ,margin:"0 10px"}}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", width: "100%", fontSize: "20px", background: "#fff2e0", borderRadius: "10px", color: "#f25c05" }}>
                    Application
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }} >
                <div style={{ display: "flex", width: "100%", flex: 1, alignItems: "center", justifyContent: "flex-start", marginBottom: "10px" }}>
                    <div style={{ display: "flex", textTransform: "capitalize", fontSize: "18px" }} >
                        Name: {item.employeeId.fullName}
                    </div>
                </div>


                <div style={{ display: "flex", textTransform: "capitalize", fontSize: "18px", flexDirection: "column", marginBottom: "15px" }} >
                    <div>
                        Cover Letter:
                    </div>
                    <p style={{ fontSize: "16px", color: "GrayText" }} >
                        {item?.coverLetter}
                    </p>
                </div>

                <div style={{ display: "flex", width: "100%", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                    {isMobile ? (<>
                        <Button
                            variant='outlined'
                            sx={{ marginLeft: "" }}
                            onClick={handlePrint}
                        >
                            Download CV
                        </Button>
                        <div style={{ display: "none" }} >
                            <CVCanvas
                                cv={cv}
                            />
                        </div>
                    </>
                    ) : (
                        <Button
                            variant='outlined'
                            sx={{ marginLeft: "" }}
                            onClick={() => {
                                setIsCV(true)
                            }}
                        >
                            Open CV
                        </Button>
                    )}

                    <FormControl>
                        <InputLabel id="type-label">Status</InputLabel>
                        <Select
                            labelId="status"
                            id="status"
                            name="status"
                            value={status}
                            size="small"
                            onChange={handleChange}
                            label="Status"
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Reviewed">Reviewed</MenuItem>
                            <MenuItem value="Accepted">Accepted</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>

                </div>

            </div>
        </div>
    ) : (
        <div style={{ display: "flex", width: "55%", boxSizing: "border-box", margin: "20px", flexDirection: "column" }} >

            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "5px" }} >

                <IconButton
                    onClick={() => {
                        setIsCV(false)
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: "25px", color: "white" }} />
                </IconButton>

                <IconButton onClick={handlePrint}>
                    <CloudDownloadIcon sx={{ fontSize: "25px", color: "white" }} />
                </IconButton>

            </div>

            <CVCanvas
                cv={cv}
            />
        </div>
    );
}

export default ApplicationDetails;

