import React, { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import JobEditModal from './JobEditModal';

const JobPostingDetails = ({ data, setIsEditVisibile, setToRefreshApplications, isEditVisibile }) => {

    useEffect(() => {
        const container = document.querySelector('.requirements-container');
        if (!container) return;

        const items = container.querySelectorAll('span');

        if (items.length > 0) {
            const firstItemTop = items[0].getBoundingClientRect().top;

            // Check if any item is on a different row
            const isWrapped = Array.from(items).some(
                item => item.getBoundingClientRect().top > firstItemTop
            );

            if (isWrapped) {
                Array.from(items).forEach((item, index) => {
                    if (index < items.length && item.getBoundingClientRect().top === firstItemTop) {
                        item.style.marginBottom = '5px';
                    }
                });
            }
        }
    }, []);

    return (
        <Box className='job-posting'>
            {/* Job details */}
            <Box display="flex" marginBottom="13px" textTransform="capitalize">
                <Box fontSize="16px" flex={1}>
                    <strong fontSize="14px">Company Name:</strong> {data?.companyName}
                </Box>
                <Box fontSize="16px" flex={1}>
                    <strong fontSize="14px">Location:</strong> {data?.location}
                </Box>
            </Box>
            <Box display="flex" marginBottom="13px">
                <Box fontSize="16px" flex={1} textTransform="capitalize">
                    <strong fontSize="14px">Job Title:</strong> {data?.jobTitle}
                </Box>
                <Box flex={1} flexWrap="wrap" display="flex">
                    <strong fontSize="14px">Requirements:</strong>
                    <Box className="requirements-container">
                        {data?.skills?.map((item, index) => (
                            <Box className="requirement"  key={index}>
                                {item?.name}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Box display="flex" marginBottom="13px" textTransform="capitalize">
                <Box fontSize="16px" flex={1}>
                    <strong fontSize="14px">Application Deadline:</strong> {moment(data?.applicationDeadline).format("YYYY/MM/DD")}
                </Box>
                <Box flex={1}>
                    <strong fontSize="14px">Status:</strong> {data?.status}
                </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="flex-start" alignItems="flex-start">
                <Box marginBottom="10px" fontSize="16px" color="GrayText">
                    <strong fontSize="14px" color="black">Description:</strong>
                    {data?.description}
                </Box>
                <Box alignSelf="flex-start">
                    <IconButton onClick={() => setIsEditVisibile(true)}>
                        <EditIcon color='primary' />
                    </IconButton>
                </Box>
            </Box>
            <JobEditModal
                jobData={data}
                isVisible={isEditVisibile}
                onClose={() => setIsEditVisibile(false)}
                setToRefreshApplications={e => setToRefreshApplications(e)}
            />
        </Box>
    );
};

export default JobPostingDetails;

