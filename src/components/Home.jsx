import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosInstance.js';// axiosInstance 가져오기

const Home = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        hello();
    }, []);

    const hello = async () => {
        try {
            const response = await axiosInstance.get('/test/');
            setGreeting(response.data);
        } catch (error) {
            console.error('Error fetching greeting', error);
        }
    }

    return (
        <>
            <h1>{greeting}</h1>
        </>
    );
}

export default Home;
