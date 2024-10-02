import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomePage from '../HomePage';
import LoginPage from '../LoginPage';
import SignupPage from '../SignupPage';
import ChoseRolepage from '../ChoseRolepage';
import CVBuilderPage from '../CVBuilderPage';
import JobPostingPage from '../JobPostingPage';
import JobListingPage from '../JobListingPage';
import AppliedAppsPage from '../AppliedAppsPage';
import UsersPage from '../UsersPage';
import JobsAdminPage from '../JobsAdminPage';
import JobPostingDetails from '../JobPostingDetails';
import SkillsPage from '../SkillsPage';

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
