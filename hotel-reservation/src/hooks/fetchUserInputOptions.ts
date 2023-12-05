import { useEffect, useState } from "react";

export function fetchUserInputOptions(field: string) {
    const [options, setOptions] = useState([]);
    const API_ENDPOINT = process.env.REACT_APP_UserInputOptionsUrl;

    useEffect(() => {
        fetch(`${API_ENDPOINT}/${field}`)
            .then((response) => response.json())
            .then((data) => setOptions(data))
            .catch((error) => console.error(`Error fetching ${field}:`, error));
    }, []);

    return options;
}