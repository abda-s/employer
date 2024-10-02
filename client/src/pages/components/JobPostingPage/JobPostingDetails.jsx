import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import JobEditModal from './JobEditModal';

const JobPostingDetails = ({ data, setIsEditVisibile, setToRefresh, isEditVisibile }) => {

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
        <div className='job-posting'>
            {/* Job details */}
            <div style={{ display: "flex", marginBottom: "13px", textTransform: "capitalize" }}>
                <div style={{ fontSize: "16px", flex: 1 }}>
                    <strong style={{ fontSize: "14px" }}>Company Name:</strong> {data?.companyName}
                </div>
                <div style={{ fontSize: "16px", flex: 1 }}>
                    <strong style={{ fontSize: "14px" }}>Location:</strong> {data?.location}
                </div>
            </div>
            <div style={{ display: "flex", marginBottom: "13px" }}>
                <div style={{ fontSize: "16px", flex: 1, textTransform: "capitalize" }}>
                    <strong style={{ fontSize: "14px" }}>Job Title:</strong> {data?.jobTitle}
                </div>
                <div style={{ flex: 1, flexWrap: "wrap", display: "flex" }}>
                    <strong style={{ fontSize: "14px" }}>Requirements:</strong>
                    <div className="requirements-container">
                        {data?.skills?.map((item, index) => (
                            <span key={index}>
                                {item?.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", marginBottom: "13px", textTransform: "capitalize" }}>
                <div style={{ fontSize: "16px", flex: 1 }}>
                    <strong style={{ fontSize: "14px" }}>Application Deadline:</strong> {moment(data?.applicationDeadline).format("YYYY/MM/DD")}
                </div>
                <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "14px" }}>Status:</strong> {data?.status}
                </div>
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <div style={{ marginBottom: "10px", fontSize: "16px", color: "GrayText" }}>
                    <strong style={{ fontSize: "14px", color: "black" }}>Description:</strong>
                    {data?.description}
                </div>
                <div style={{ alignSelf: "flex-start" }}>
                    <IconButton onClick={() => setIsEditVisibile(true)}>
                        <EditIcon color='primary' />
                    </IconButton>
                </div>
            </div>
            <JobEditModal
                jobData={data}
                isVisible={isEditVisibile}
                onClose={() => setIsEditVisibile(false)}
                setToRefresh={e => setToRefresh(e)}
            />
        </div>
    );
};

export default JobPostingDetails;
