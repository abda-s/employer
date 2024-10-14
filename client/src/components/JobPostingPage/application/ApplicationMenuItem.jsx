import React, { useState } from 'react'
import moment from 'moment'
import ApplicationModel from './ApplicationModel';
import { Box } from '@mui/material';

function ApplicationMenuItem({ index, item, data,setToRefreshApplications }) {
    const [isVisible, setIsVisible] = useState(false)



    return (
        <>
            <Box
                key={index}
                className="app-side-menu-item"
                onClick={() => {
                    setIsVisible(true)
                }}
            >
                <Box style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                    <Box
                        style={{ textTransform: "capitalize" }}
                    >{item?.employeeId?.fullName}</Box>
                    <Box
                        style={{ fontSize: "12px", padding: "5px", background: "#fff2e0", color: "#f25c05", borderRadius: "10px", border: "solid 1px #f25c05" }}
                    >{item?.status}
                    </Box>
                </Box>
                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                    <Box
                        style={{ textTransform: "capitalize", color: "GrayText" }}
                    >
                        {item?.employeeId?.phoneNumber}
                    </Box>
                    <Box style={{ color: "GrayText" }} >
                        {moment(item?.applicationDate).format("YYYY/MM/DD")}
                    </Box>
                </Box>
            </Box>
            <ApplicationModel
                isVisible={isVisible}
                setIsVisible={(e) => setIsVisible(e)}

                item={item}
                cv={item?.employeeId}
                status={item?.status}
                data={data}
                setToRefreshApplications={e => setToRefreshApplications(e)}
            />
        </>
    )
}

export default ApplicationMenuItem
