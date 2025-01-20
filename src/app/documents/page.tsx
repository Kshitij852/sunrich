"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import PageCard from "./(components)/pageCard"; // Ensure the path is correct

const Page = () => {
    const [data, setData] = useState<any[]>([]); // State to store API data
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null); // Selected page ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token =
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdlNTRlYWZmNzI0OGE2MThjODRiNzciLCJmaXJzdE5hbWUiOiJOaWtoaWwiLCJsYXN0TmFtZSI6IlNpbmdoIiwiZW1haWwiOiJOaWtoaWxAYXRvbW9zdGVjaC5jb20iLCJnSWQiOiI2NzNjMjdmZGJkZGEwOGE1NGU3NDU1ZDkiLCJpYXQiOjE3MzczNjMzNzcsImV4cCI6MTczNzQ0OTc3N30.sH8XzGT5V76qy154KcX6yvdMKJEK4ktQ3_4HlMVYtQo";
                const response = await fetch(
                    "http://localhost:7071/api/content/getProjectContentByProjectId/677e5536ff7248a618c84b81",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const result = await response.json();
                if (result?.data) {
                    setData(result.data);
                    console.log("result", result.data)
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
    }, []);

    const handlePageSelection = (pageId: string) => {
        setSelectedPageId(pageId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Project Tab</h1>

            {loading && (
                <p className="text-xl text-blue-500 text-center">Loading content, please wait...</p>
            )}
            {error && (
                <p className="text-xl text-red-500 text-center">Error: {error}</p>
            )}

            {!loading && !error && data.length > 0 && (
                <div className="space-y-6">
                    {/* Page navigation buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.map((page) => {
                            console.log("Rendering button for page:", page);
                            return (
                                <button
                                    key={page._id}
                                    onClick={() => handlePageSelection(page._id)}
                                    className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                >
                                    {page.page_no}: {page.page_name}
                                </button>
                            );
                        })}
                    </div>

                    {/* PageCard component for the selected page */}
                    {selectedPageId && (
                        <div className="mt-6">
                            <PageCard data={data.find((page) => page._id === selectedPageId)} />
                        </div>
                    )}
                </div>
            )}

            {!loading && !error && data.length === 0 && (
                <p className="text-xl text-gray-500 text-center">No pages found.</p>
            )}
        </div>
    );
};

export default Page;
