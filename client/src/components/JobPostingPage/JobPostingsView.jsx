import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import JobEditModal from './JobEditModal';
import JobPostingCard from './JobPostingCard'; // Import the new card component
import axios from 'axios';
import { serverURL } from '../../constants';

function JobPostingsView({ data, setIndexOfJob }) {
    const role = useSelector(state => state.auth.role);
    const token = useSelector(state => state.auth.token);

    const [isVisible, setIsVisible] = useState(false);
    const [indexOfItem, setIndexOfItem] = useState(null);


    const handleSave = async (values) => {
        try {
            await axios.put(`${serverURL}/job-posting/edit-job`, {
                ...values,
                postId: data[indexOfItem]._id,
            }, { headers: { accessToken: token } });

            setIsVisible(false);
            setIndexOfItem(null);
        } catch (error) {
            console.error("Error saving job posting:", error);
        }
    };

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
                    onSave={handleSave}
                    setIndexOfItem={setIndexOfItem}
                    
                />
            )}
        </div>
    );
}

export default JobPostingsView;
