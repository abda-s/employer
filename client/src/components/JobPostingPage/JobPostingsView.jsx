import React, { useState } from 'react';
import JobEditModal from './JobEditModal';
import JobPostingCard from './JobPostingCard'; // Import the new card component

function JobPostingsView({ data, setIndexOfJob }) {
    const [isVisible, setIsVisible] = useState(false);
    const [indexOfItem, setIndexOfItem] = useState(null);

    return (
        <div className='job-posting-view-con' >
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
        </div>
    );
}

export default JobPostingsView;
