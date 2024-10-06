import React, { useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import JobApplyModal from './JobApplyModal';
import JobListingItem from './JobListingItem'; // Import the new card component
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { CircularProgress } from '@mui/material';

function JobListingView() {
    const { response: jobs, error, isLoading } = useAxios({ url: '/job-posting/job-listing', method: 'GET'});

    const [isVisible, setIsVisible] = useState(false);
    const [index, setIndex] = useState(null);

    if (isLoading) return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw'}}>
            <CircularProgress />
        </div>
    );
    if (error) return <div>Error: {error.message}</div>

    return (

        <div className='job-listing-con'>
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                <Masonry >
                    {jobs?.map((item, i) => (
                        <JobListingItem
                            key={index}
                            item={item}
                            index={i}
                            onApplyClick={() => {
                                setIsVisible(true)
                                setIndex(i)
                            }}
                        />
                    ))}
                </Masonry>
            </ResponsiveMasonry>


            <JobApplyModal
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                id={jobs?.[index]?._id}
            />
        </div>
    );
}

export default JobListingView;

