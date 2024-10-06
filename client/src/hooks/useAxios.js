import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { serverURL } from '../constants';

axios.defaults.baseURL = serverURL;

export const useAxios = ({ url, method, body = null, headers: customHeaders = null }) => {
    const accessToken = useSelector(state => state.auth.token);

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        let headers = { ...customHeaders };

        if (accessToken) {
            headers['accessToken'] = accessToken; // Changed to 'Authorization' for better practice
        }

        try {
            const res = await axios({
                method,
                url,
                data: method === 'POST' || method === 'PUT' ? body : undefined, // Avoid sending body for GET requests
                headers,
            });
            setResponse(res.data);
        } catch (err) {
            console.error('Error fetching data:', err); // Log the error for debugging
            setError(err.response ? err.response.data : 'An error occurred'); // Capture response error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [method, url, body, customHeaders, accessToken]); // Added customHeaders and accessToken to dependencies

    return { response, error, isLoading };
};

