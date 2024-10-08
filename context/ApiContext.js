'use client'
import { createContext, useEffect, useState } from "react";


export const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {

    const [api, setApi] = useState(null);
    const apis = [
        '/api/posts',
        '/api/pappies',
        '/api/penelopes',
        '/api/wellers',
        '/api/yamazakis',
        '/api/baltons',
        '/api/buffalos'
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Promise.all(apis.map(async api => {
                    const response = await fetch(api);
                    return response.json();
                }))
                setApi(data.flat());
                console.log('Fetched data:', api);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [api])

    console.log(api);
    

    return (
        <ApiContext.Provider vlaue={{ api }} >
            {children}
        </ApiContext.Provider>
    )
}