import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

//admin
import UsersManagementPage from '../pages/admin/UsersManagementPage';
import JobsManagementPage from '../pages/admin/JobsManagementPage';
import JobPostingDetails from '../pages/admin/JobPostingDetails';
import SkillsManagementPage from '../pages/admin/SkillsManagementPage';

//auth
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

//employee
import CVBuilderPage from '../pages/employee/CVBuilderPage';
import JobListingPage from '../pages/employee/JobListingPage';
import AppliedAppsPage from '../pages/employee/AppliedAppsPage';

//employer
import JobPostingPage from '../pages/employer/JobPostingPage';

//shared
import HomePage from '../pages/shared/HomePage'
import RoleSelectionPage from '../pages/shared/RoleSelectionPage';

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
            { path: '/dashboard/users', element: <UsersManagementPage /> },
            { path: '/dashboard/jobs', element: <JobsManagementPage /> },
            { path: '/dashboard/jobs/:id', element: <JobPostingDetails /> },
            { path: '/dashboard/skills', element: <SkillsManagementPage /> },

        ],
    };

    return (
        <Routes>
            {loggedIn ? (
                <>
                    {!role ? (
                        <Route path="/choose-role" element={<RoleSelectionPage />} />
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
