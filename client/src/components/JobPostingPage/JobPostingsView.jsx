import React, { useState } from 'react';
import { Box } from '@mui/material';
import JobEditModal from './JobEditModal';
import JobPostingCard from './JobPostingCard'; // Import the new card component

function JobPostingsView({ data, setIndexOfJob }) {
    const [isVisible, setIsVisible] = useState(false);
    const [indexOfItem, setIndexOfItem] = useState(null);

    return (
        <Box className='job-posting-view-con' >
            {data?.map((item, index) => (
                <JobPostingCard
                    index={index}
                    key={index}
                    item={item}
                    setIndexOfJob={e => setIndexOfJob(e)}
                    setIsVisible={e => setIsVisible(e)}
                />

            ))}

            {indexOfItem !== null && (
                <JobEditModal
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                    jobData={data[indexOfItem]}
                    setIndexOfItem={setIndexOfItem}

                />
            )}
        </Box>
    );
}

export default JobPostingsView;

