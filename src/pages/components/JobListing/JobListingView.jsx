import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverURL } from '../../../constants';
import JobApplyModal from './JobApplyModal';
import JobListingItem from './JobListingItem'; // Import the new card component
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"


function JobListingView() {
    const [data, setData] = useState([]);
    const accessToken = useSelector(state => state.auth.token);

    const [isVisible, setIsVisible] = useState(false);
    const [index, setIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${serverURL}/job-posting/job-listing`;
                const response = await axios.get(url, { headers: { accessToken } });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching job postings:", error);
            }
        };
        fetchData();
    }, [isVisible]);

    return (

        <div className='job-listing-con'>
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                <Masonry >
                    {data?.map((item, i) => (
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
                id={data?.[index]?._id}
            />
        </div>
    );
}

export default JobListingView;
