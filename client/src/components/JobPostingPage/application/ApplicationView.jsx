import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApplicationMenuItem from './ApplicationMenuItem';
import { IconButton, CircularProgress, useMediaQuery, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import JobPostingDetails from '../JobPostingDetails';
import SortApplicationsMenu from './SortApplicationsMenu';
import { useAxios } from '../../../hooks/useAxios';

function ApplicationView({ id, goBack, toRefesh }) {
    const role = useSelector(state => state.auth.role);

    const [filteredApplications, setFilteredApplications] = useState([]);
    const [isEditVisibile, setIsEditVisibile] = useState(false);
    const [toRefreshApplications,setToRefreshApplications] = useState(null);
    const isMobile = useMediaQuery('(max-width:600px)');


    const { response: data, error, isLoading } = useAxios({
        url: `/application/get-applications/${id}`,
        method: "GET",
        dependencies: [id, toRefesh,toRefreshApplications]
    });

    useEffect(() => {
        setFilteredApplications([])
    },[id,toRefesh]);



    const sortApplicationsByStatus = (status) => {
        if (status === 'All') {
            setFilteredApplications(data?.applications);
        } else {
            const sorted = data?.applications?.filter(app => app.status === status);
            setFilteredApplications(sorted);
        }
    };



    return (
        <Box display="flex" flexDirection="column" flex={1} height="100%" justifyContent="flex-start" boxSizing="border-box">
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography variant="h6" color="error">
                        {error.message}
                    </Typography>
                </Box>
            ) : (
                <>
                    {(isMobile || role === "admin") && (
                        <Box width="100%" marginBottom="5px" onClick={goBack}>
                            <IconButton>
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>
                    )}

                    <JobPostingDetails
                        data={data}
                        setIsEditVisibile={setIsEditVisibile}
                        setToRefreshApplications={setToRefreshApplications}
                        isEditVisibile={isEditVisibile}
                    />

                    <SortApplicationsMenu
                        sortApplicationsByStatus={e=>sortApplicationsByStatus(e)}
                    />

                    {filteredApplications.map((item, index) => (
                        <ApplicationMenuItem
                            key={index}
                            index={index}
                            item={item}
                            setToRefreshApplications={(e) => setToRefreshApplications(e)}
                            data={data}
                        />
                    ))}
                </>
            )}
        </Box>

    );
}

export default ApplicationView;


