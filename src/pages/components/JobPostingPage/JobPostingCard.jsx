import React from 'react';

function JobPostingCard({ item, index, setIndexOfJob, setIsVisible }) {
    return (
        <div key={index} className='job-posting-item'
            onClick={() => {
                setIndexOfJob(index)
                setIsVisible(true)
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }} >
                <div style={{ fontSize: "16px", flex: 1, alignItems: "center", marginBottom: "5px" }}>
                    <strong style={{ fontSize: "14px" }} >Job Title:</strong> {item.jobTitle}
                </div>

                <div style={{ flex: 1, display: "flex", alignItems: "center", flexWrap: "wrap", marginBottom: "5px" }}>
                    {item.skills.map((s, i) => (
                        <span key={i} style={{ fontSize: "12px", padding: "5px", background: "#fff2e0", color: "#f25c05", borderRadius: "5px", border: "solid 1px #f25c05", marginLeft: i === 0 ? "0" : "5px", boxSizing: "border-box", marginBottom: "2px" }} >
                            {s?.name}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: "10px", fontSize: "16px", color: "GrayText" }}>
                {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
            </div>
        </div>
    );
}

export default JobPostingCard;
