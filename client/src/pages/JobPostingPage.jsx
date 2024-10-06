import React, { useState } from 'react'
import NavBar from '../components/NavBar';
import { Button, CircularProgress, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import "../styles/JobPostingPage.css"

import ApplicationView from '../components/jobPostingPage/application/ApplicationView';
import JobPostingsView from '../components/jobPostingPage/JobPostingsView';
import JobPostingModal from '../components/jobPostingPage/JobPostingModal';
import { useAxios } from '../hooks/useAxios';

function JobPostingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [indexOfJob, setIndexOfJob] = useState(null);
    const [toRefesh, setToRefresh] = useState(null)

    const isMobile = useMediaQuery('(max-width:600px)');

    const { response: jobs, error, isLoading } = useAxios({
        url: `/job-posting/posted-jobs`,
        method: "GET",
        dependencies: [toRefesh]
    })


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
                                <ApplicationView id={jobs[indexOfJob]._id} goBack={() => setIndexOfJob(null)} indexOfJob={indexOfJob} setToRefresh={e => setToRefresh(e)} toRefesh={toRefesh} />
                            )}

                            {isMobile && indexOfJob === null && (
                                <div style={{ display: "flex", flex: 1, boxSizing: "border-box" }}>
                                    <JobPostingsView
                                        data={jobs}
                                        setIndexOfJob={e => setIndexOfJob(e)}
                                    />
                                </div>
                            )}

                            {!isMobile && (
                                <div style={{ display: "flex", height: "100%", boxSizing: "border-box", flex: 1 }}>
                                    <div style={{ display: "flex", flex: 1, boxSizing: "border-box", overflowY: "auto", height: "100%" }} >
                                        <JobPostingsView
                                            data={jobs}
                                            setIndexOfJob={e => setIndexOfJob(e)}
                                        />
                                    </div>
                                    <div className='application-view' >
                                        {indexOfJob !== null && (
                                            <ApplicationView
                                                id={jobs[indexOfJob]._id}
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

