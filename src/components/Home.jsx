import axios from "axios";
import {BACK_URL} from "../Constraints.js"
import {useEffect, useState} from "react";

const Home = () => {

    const [greeting, setGreeting] = useState(false)

    useEffect(() => {
        hello();
    }, []);

    const hello = async () => {
        try {
            const response = await axios.get(BACK_URL + '/test/');
            setGreeting(response.data);
        } catch (error) {
            console.error('Error fetching greeting', error);
        }
    }

    return (
        <>
            <h1>{greeting}</h1>
        </>
    )
}

export default Home;