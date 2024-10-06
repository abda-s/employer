import React, {useState } from 'react';
import JobEditModal from './JobEditModal';
import JobPostingCard from './JobPostingCard'; // Import the new card component
import { useAxios } from '../../hooks/useAxios';


function JobPostingsView({ data, setIndexOfJob }) {

    const [isVisible, setIsVisible] = useState(false);
    const [indexOfItem, setIndexOfItem] = useState(null);
    const [error, setError] = useState(null);

    const { isLoading, fetchData } = useAxios({
        url: `/job-posting/posted-jobs`,
        method: "PUT",
        manual: true,
    });

    const handleSave = async (values) => {
        try {
            const result = await fetchData({
                body:
                {
                    ...values,
                    postId: data[indexOfItem]._id,
                }
            });

            if (result && !result.error) {
                setIndexOfItem(null);
                setIsVisible(false);
            }

        } catch (error) {
            console.error("Error saving job posting:", error);
            setError(error);
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
