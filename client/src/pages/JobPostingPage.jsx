import React, { useState, useEffect } from 'react'
import NavBar from './components/NavBar';
import { Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { serverURL } from '../constants';
import "../styles/JobPostingPage.css"

import ApplicationView from './components/JobPostingPage/application/ApplicationView';
import JobPostingsView from './components/JobPostingPage/JobPostingsView';
import JobPostingModal from './components/JobPostingPage/JobPostingModal';
import DashboradSideMenu from './components/DashboradSideMenu';

function JobPostingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector(state => state.auth.token);
    const [indexOfJob, setIndexOfJob] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [toRefesh, setToRefresh] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${serverURL}/job-posting/posted-jobs`;
                const response = await axios.get(url, { headers: { accessToken: token } });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching job postings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [indexOfJob, toRefesh]);

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

    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh", margin: "0" }} >
            <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column" }} >
                <NavBar title="Job" />

                <div style={{ position: 'fixed', right: '50px', bottom: '50px' }} >
                    <Button
                        variant="contained"
                        color="primary"
                        size='large'
                        onClick={() => {
                            setIsVisible(true)
                        }}
                    >
                        <AddIcon />
                    </Button>
                </div>

                <JobPostingModal
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    setToRefresh={e => setToRefresh(e)}
                    toRefesh={toRefesh}
                />

                <div style={{ display: "flex", height: "100%", boxSizing: "border-box", width: "100%", flex: 1 }}>
                    {isLoading ? (
                        <div style={{ flex: 1, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <>
                            {isMobile && indexOfJob !== null && (
                                <ApplicationView id={data[indexOfJob]._id} goBack={() => setIndexOfJob(null)} indexOfJob={indexOfJob} setToRefresh={e => setToRefresh(e)} toRefesh={toRefesh} />
                            )}

                            {isMobile && indexOfJob === null && (
                                <div style={{ display: "flex", flex: 1, boxSizing: "border-box" }}>
                                    <JobPostingsView
                                        data={data}
                                        setIndexOfJob={e => setIndexOfJob(e)}
                                    />
                                </div>
                            )}

                            {!isMobile && (
                                <div style={{ display: "flex", height: "100%", boxSizing: "border-box", flex: 1 }}>
                                    <div style={{ display: "flex", flex: 1, boxSizing: "border-box", overflowY: "auto", height: "100%" }} >
                                        <JobPostingsView
                                            data={data}
                                            setIndexOfJob={e => setIndexOfJob(e)}
                                        />
                                    </div>
                                    <div className='application-view' >
                                        {indexOfJob !== null && (
                                            <ApplicationView
                                                id={data[indexOfJob]._id}
                                                setToRefresh={e => setToRefresh(e)}
                                                toRefesh={toRefesh}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobPostingPage;
