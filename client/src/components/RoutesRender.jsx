import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ChoseRolepage from '../pages/ChoseRolepage';
import CVBuilderPage from '../pages/CVBuilderPage';
import JobPostingPage from '../pages/JobPostingPage';
import JobListingPage from '../pages/JobListingPage';
import AppliedAppsPage from '../pages/AppliedAppsPage';
import UsersPage from '../pages/admin/UsersPage';
import JobsAdminPage from '../pages/admin/JobsAdminPage';
import JobPostingDetails from '../pages/admin/JobPostingDetails';
import SkillsPage from '../pages/admin/SkillsPage';

function RoutesRender() {
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const role = useSelector(state => state.auth.role);
    const [defaultRoute, setDefaultRoute] = useState('/dashboard/job-posting');

    useEffect(() => {
        if (loggedIn) {
            switch (role) {
                case 'employee':
                    setDefaultRoute('/job-listing');
                    break;
                case 'employer':
                    setDefaultRoute('/dashboard/job-posting');
                    break;
                case 'admin':
                    setDefaultRoute('/dashboard/users');
                    break;
                default:
                    setDefaultRoute('/choose-role');
            }
        } else {
            setDefaultRoute('/');
        }
    }, [loggedIn, role]);

    const publicRoutes = [
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <SignupPage /> },
        { path: '/', element: <HomePage /> },
    ];

    const roleBasedRoutes = {
        employee: [
            { path: '/cv-builder', element: <CVBuilderPage /> },
            { path: '/dashboard/applied-jobs', element: <AppliedAppsPage /> },
            { path: '/job-listing', element: <JobListingPage /> },
        ],
        employer: [
            { path: '/dashboard/job-posting', element: <JobPostingPage /> },
        ],
        admin: [
            { path: '/dashboard/users', element: <UsersPage /> },
            { path: '/dashboard/jobs', element: <JobsAdminPage /> },
            { path: '/dashboard/jobs/:id', element: <JobPostingDetails /> },
            { path: '/dashboard/skills', element: <SkillsPage /> },

        ],
    };

    return (
        <Routes>
            {loggedIn ? (
                <>
                    {!role ? (
                        <Route path="/choose-role" element={<ChoseRolepage />} />
                    ) : (
                        roleBasedRoutes[role]?.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))
                    )}
                </>
            ) : (
                publicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))
            )}

            <Route path="*" element={<Navigate to={defaultRoute} />} />
        </Routes>
    );
}

export default RoutesRender;
