import React, { useState } from 'react'
import moment from 'moment'
import ApplicationModel from './ApplicationModel';

function ApplicationMenuItem({ index, item, data,setToRefreshApplications }) {
    const [isVisible, setIsVisible] = useState(false)


    return (
        <>
            <div
                key={index}
                className="app-side-menu-item"
                onClick={() => {
                    setIsVisible(true)
                }}
            >
                <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                    <span
                        style={{ textTransform: "capitalize" }}
                    >{item?.employeeId?.fullName}</span>
                    <span
                        style={{ fontSize: "12px", padding: "5px", background: "#fff2e0", color: "#f25c05", borderRadius: "10px", border: "solid 1px #f25c05" }}
                    >{item?.status}
                    </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                    <span
                        style={{ textTransform: "capitalize", color: "GrayText" }}
                    >
                        {item?.employeeId?.phoneNumber}
                    </span>
                    <span style={{ color: "GrayText" }} >
                        {moment(item?.applicationDate).format("YYYY/MM/DD")}
                    </span>
                </div>
            </div>
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