import React, { useState } from 'react'
import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useAxios } from '../../hooks/useAxios';

import NavBar from '../../components/NavBar';
import ApplicationView from '../../components/jobPostingPage/application/ApplicationView';
import JobPostingsView from '../../components/jobPostingPage/JobPostingsView';
import JobPostingModal from '../../components/jobPostingPage/JobPostingModal';

import "../../styles/JobPostingPage.css"


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
        <Box sx={{ display: "flex", width: "100vw", height: "100vh", margin: "0" }} >
            <Box sx={{ display: "flex", width: "100%", height: "100%", flexDirection: "column" }} >
                <NavBar title="Job" />

                <Box sx={{ position: 'fixed', right: '50px', bottom: '50px' }} >
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
                </Box>

                <JobPostingModal
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    setToRefresh={e => setToRefresh(e)}
                    toRefesh={toRefesh}
                />

                <Box sx={{ display: "flex", height: "100%", boxSizing: "border-box", width: "100%", flex: 1 }}>
                    {isLoading ? (
                        <Box sx={{ flex: 1, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {isMobile && indexOfJob !== null && (
                                <ApplicationView className='application-view' id={jobs[indexOfJob]._id} goBack={() => setIndexOfJob(null)} indexOfJob={indexOfJob} setToRefresh={e => setToRefresh(e)} toRefesh={toRefesh} />
                            )}

                            {isMobile && indexOfJob === null && (
                                <Box sx={{ display: "flex", flex: 1, boxSizing: "border-box" }}>
                                    <JobPostingsView
                                        className='job-postings-view'
                                        data={jobs}
                                        setIndexOfJob={e => setIndexOfJob(e)}
                                    />
                                </Box>
                            )}

                            {!isMobile && (
                                <Box sx={{ display: "flex", height: "100%", boxSizing: "border-box", flex: 1 }}>
                                    <Box sx={{ display: "flex", flex: 1, boxSizing: "border-box", overflowY: "auto", height: "100%" }} >
                                        <JobPostingsView
                                            className='job-postings-view'
                                            data={jobs}
                                            setIndexOfJob={e => setIndexOfJob(e)}
                                        />
                                    </Box>
                                    <Box className='application-view' >
                                        {indexOfJob !== null && (
                                            <ApplicationView
                                                id={jobs[indexOfJob]._id}
                                                setToRefresh={e => setToRefresh(e)}
                                                toRefesh={toRefesh}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default JobPostingPage;

