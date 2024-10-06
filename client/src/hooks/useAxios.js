import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverURL } from '../constants';

axios.defaults.baseURL = serverURL;

export const useAxios = ({ url, method, manual = false, dependencies = [] }) => {
    const accessToken = useSelector(state => state.auth.token);

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Store the request function so it can be called manually
    const fetchData = useCallback(async (params = {}) => {
        setIsLoading(true);
        let headers = {};

        if (accessToken) {
            headers['accessToken'] = accessToken;
        }

        try {
            const res = await axios({
                method,
                url,
                data: (method === 'POST' || method === 'PUT') ? params.body : undefined,
                headers,
            });

            setResponse(res.data);
            console.log(res.data);
            
            return res.data; // Return the response data

        } catch (err) {
            console.error('Error fetching data:', err); // Log error for debugging
            const errorMessage = err.response ? err.response.data : 'An error occurred';
            setError(errorMessage); // Capture error message
            return { error: errorMessage }; // Return the error

        } finally {
            setIsLoading(false);
        }
    }, [accessToken, method, url]);

    useEffect(() => {
        if (!manual) {
            fetchData(); // Automatically fetch data unless manual trigger is required
        }
    }, [fetchData, manual, ...dependencies]); // Add dependencies to refetch data when they change

    return { response, error, isLoading, fetchData }; // Return fetchData to trigger request manually
};
