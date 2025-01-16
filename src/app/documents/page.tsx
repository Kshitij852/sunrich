"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import PageCard from "./(components)/pageCard"; // Make sure the path is correct

const Page = () => {
    const [data, setData] = useState<any>(""); // State to store API data
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null); // State to store selected page ID

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Reset error before each fetch

            try {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdlNTRlYWZmNzI0OGE2MThjODRiNzciLCJmaXJzdE5hbWUiOiJOaWtoaWwiLCJsYXN0TmFtZSI6IlNpbmdoIiwiZW1haWwiOiJOaWtoaWxAYXRvbW9zdGVjaC5jb20iLCJnSWQiOiI2NzNjMjdmZGJkZGEwOGE1NGU3NDU1ZDkiLCJpYXQiOjE3MzY5MzQ2NDgsImV4cCI6MTczNzAyMTA0OH0.sKBgRy71z-RBLuhV6__k8nWJOBAXL9PFob3JXvCClXQ'
                const response = await fetch(`http://localhost:7071/api/content/getProjectContentByProjectId/677e5536ff7248a618c84b81`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const result = await response.json();

                if (result) {
                    setData(result.data);
                } else {
                    throw new Error("Content is missing in the response.");
                }

            } catch (err: any) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    const handleOpenNewTab = (pageId: string) => {
        setSelectedPageId(pageId); // Set selected page ID when a button is clicked
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Project Tab</h1>

            {loading && <p className="text-xl text-blue-500 text-center">Loading content, please wait...</p>}
            {error && <p className="text-xl text-red-500 text-center">Error: {error}</p>}

            {!loading && !error && data.length > 0 && (
                <div className="space-y-6">
                    {/* Dynamic navigation buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.map((page: any) => (
                            <button
                                key={page._id}
                                onClick={() => handleOpenNewTab(page._id)} // Set selected page ID on button click
                                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                {page.page_no}: {page.page_name}
                            </button>
                        ))}
                    </div>

                    {/* Conditionally render the PageCard component */}
                    {selectedPageId && (
                        <div className="mt-6">
                            <PageCard data={data.find((page: any) => page._id === selectedPageId)} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Page;
