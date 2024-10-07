import React, { useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import JobApplyModal from './JobApplyModal';
import JobListingItem from './JobListingItem'; // Import the new card component
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { CircularProgress } from '@mui/material';

function JobListingView() {
    const [toRefeshJobListing, setToRefeshJobListing] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [index, setIndex] = useState(null);
    
    const { response: jobs, error, isLoading } = useAxios({ 
        url: '/job-posting/job-listing', 
        method: 'GET',
        dependencies: [toRefeshJobListing],
     });



    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
                <CircularProgress />
            </div>
        );
    }
    
    if (error) {
        return <div>Error: {error?.message || 'Something went wrong!'}</div>
    }

    return (
        <div className='job-listing-con'>
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
            >
                <Masonry>
                    {jobs?.map((item, i) => (
                        <JobListingItem
                            key={item._id}  // Use item._id as the unique key
                            item={item}
                            index={i}
                            onApplyClick={() => {
                                setIsVisible(true);
                                setIndex(i);
                            }}
                        />
                    ))}
                </Masonry>
            </ResponsiveMasonry>

            <JobApplyModal
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                id={jobs?.[index]?._id}
                setToRefeshJobListing={setToRefeshJobListing}
            />
        </div>
    );
}

export default JobListingView;
