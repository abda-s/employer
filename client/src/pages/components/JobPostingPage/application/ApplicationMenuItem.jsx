import React, { useEffect, useState } from 'react'
import moment from 'moment'
import ApplicationModel from './ApplicationModel';

function ApplicationMenuItem({ index, item, data, setData,setSortMenuItems }) {
    const [isVisible, setIsVisible] = useState(false)
    const [status, setStatus] = useState(item?.status || " Pending")

    useEffect(() => {
        setStatus(data.applications[index].status)
        
        setSortMenuItems([...new Set(data?.applications?.map(val => val.status))])

    }, [data,isVisible])

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
                    >{status}
                    </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                    <span
                        style={{ textTransform: "capitalize", color: "GrayText" }}
                    >
                        {item?.employeeId?.phoneNumber}
                    </span>
                    <span style={{ color: "GrayText" }} >
                        {moment(item.applicationDate).format("YYYY/MM/DD")}
                    </span>
                </div>
            </div>
            <ApplicationModel
                isVisible={isVisible}
                setIsVisible={(e) => setIsVisible(e)}

                item={item}
                cv={item?.employeeId}

                status={status}
                setStatus={e => setStatus(e)}

                data={data}
                setData={e => setData(e)}
            />
        </>
    )
}

export default ApplicationMenuItem