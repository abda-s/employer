import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { serverURL } from '../../../constants';
import ApplicationMenuItem from './ApplicationMenuItem';
import { IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import JobPostingDetails from '../JobPostingDetails';
import SortApplicationsMenu from './SortApplicationsMenu';

function ApplicationView({ id, goBack, setToRefresh, toRefesh }) {
    const token = useSelector(state => state.auth.token);
    const role = useSelector(state => state.auth.role);

    const [data, setData] = useState([]);
    const [sortMenuItems, setSortMenuItems] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [isEditVisibile, setIsEditVisibile] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
        };

        handleResize(); // Check on initial load
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${serverURL}/application/get-applications/${id}`, { headers: { accessToken: token } })
            .then(response => {
                setData(response.data);
                setFilteredApplications(response.data.applications);
                setSortMenuItems([...new Set(response.data.applications.map(val => val.status))]);
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false after data is fetched
            });
    }, [token, id, toRefesh]);



    const sortApplicationsByStatus = (status) => {
        if (status === 'All') {
            setFilteredApplications(data.applications);
        } else {
            const sorted = data.applications.filter(app => app.status === status);
            setFilteredApplications(sorted);
        }
    };



    return (
<div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "flex-start", boxSizing: "border-box" }}>
    {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
        </div>
    ) : (
        <>
            {(isMobile || role === "admin") && (
                <div style={{ width: "100%", marginBottom: "5px" }} onClick={goBack}>
                    <IconButton>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            )}

            <JobPostingDetails
                data={data}
                setIsEditVisibile={setIsEditVisibile}
                setToRefresh={setToRefresh}
                isEditVisibile={isEditVisibile}
            />

            <SortApplicationsMenu
                sortApplicationsByStatus={sortApplicationsByStatus}
                sortMenuItems={sortMenuItems}
            />

            {filteredApplications.map((item, index) => (
                <ApplicationMenuItem
                    key={index}
                    index={index}
                    item={item}
                    setData={setData}
                    data={data}
                    setSortMenuItems={setSortMenuItems}
                />
            ))}
        </>
    )}
</div>

    );
}

export default ApplicationView;
