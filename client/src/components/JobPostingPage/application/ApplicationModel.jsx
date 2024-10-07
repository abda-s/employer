import { Modal } from '@mui/material'
import React from 'react'
import ApplicationDetails from './ApplicationDetails'

function ApplicationModel({ isVisible, setIsVisible, item, cv, selectedItemIndex, status, setStatus, data, setToRefreshApplications }) {
    return (
        <Modal
            open={isVisible}
            onClose={() => setIsVisible(false)}
            sx={{ display: "flex", justifyContent: "center", width: "100%", height: "100%",overflowY:"scroll" }}
        >
            <ApplicationDetails
                item={item}
                selectedItemIndex={selectedItemIndex}
                status={status}
                setStatus={e => setStatus(e)}

                data={data}

                cv={cv}

                setToRefreshApplications={e => setToRefreshApplications(e)}
            />
        </Modal>
    )
}

export default ApplicationModel