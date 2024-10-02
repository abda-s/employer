import React from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import SchoolIcon from '@mui/icons-material/School';
import ExtensionIcon from '@mui/icons-material/Extension';
import moment from 'moment';
import '../../../styles/CVCanvas.css'; // Assuming you create a separate CSS file

function CVCanvas({ cv }) {

    return (
        <>
            <div id='cv-canvas' className='cv-canvas-con'>
                <div className='cv-canvas-left'>
                    <div className='cv-left-content'>

                        <div className='cv-name'>
                            <span className='cv-fullName'>
                                {cv?.fullName}
                            </span>
                        </div>

                        <div className='cv-contact-info'>
                            <div className='cv-contact-item'>
                                <MailOutlineIcon className='cv-icon email-icon' />
                                {cv?.userId?.email}
                            </div>

                            {(cv.phoneNumber !== "") && (
                                <div className='cv-contact-item'>
                                    <CallOutlinedIcon className='cv-icon phone-icon' />
                                    {cv?.phoneNumber}
                                </div>
                            )}
                        </div>

                        <div className='cv-section-container'>
                            <span className='cv-section'>
                                <SchoolIcon className='cv-icon school-icon' />
                                Education
                            </span>
                            {cv?.education?.map((item, index) => (
                                <div key={index} className='cv-education-item'>
                                    <div className='cv-education-year'>
                                        {item?.graduationYear}
                                    </div>
                                    <div className='cv-education-details'>
                                        <span className='cv-degree'>{item.degree}</span>
                                        <span className='cv-institution'>, {item.institutionName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='cv-section-container'>
                            <span className='cv-section'>
                                <ExtensionIcon className='cv-icon skill-icon' />
                                Skills
                            </span>
                            {cv?.employeeSkills?.map((item, index) => (
                                <div key={index} className='cv-skill-item'>
                                    <div className='cv-skill-name'>
                                        {item?.skillId?.name}
                                    </div>
                                    <div className='cv-skill-bar'>
                                        <div className='cv-skill-level' style={{ width: `${parseInt(item.level, 10) * 10}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <div className='cv-canvas-right'>
                    <div className='cv-right-content'>

                        <div className='cv-profile-title'>
                            Profile
                        </div>

                        <p className='cv-profile-summary'>
                            {cv?.professionalSummary}
                        </p>

                        <div className='cv-experience-title'>
                            Experience
                        </div>

                        <div className="cv-experience">
                            {cv?.experience?.map((item, index) => (
                                <div key={index} className="cv-experience-item">
                                    <div className="exp-left-con">
                                        <h3>{`${moment(item?.startDate).format("YYYY")} - ${moment(item.endDate).format("YYYY")}`}</h3>
                                        <h3>{item?.companyName}</h3>
                                    </div>
                                    <div className="exp-right-con">
                                        <h3> {item?.jobTitle} </h3>
                                        <p>
                                            {item?.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default CVCanvas;
