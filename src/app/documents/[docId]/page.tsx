"use client"; // Mark this as a client component

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Document {
    _id: string;
    projectId: string;
    page_no: number;
    page_name: string;
    order: number;
    group_no?: number; // Optional for grouped layers
    group_name?: string; // Name of the group (only for grouped layers)
    document_no: number;
    document_name: string;
    document: string;
    createdAt: string;
    updatedAt: string;
}

const Page = ({ params }: { params: { docId: string } }) => {

    console.log("params", params?.docId)




    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const router = useRouter();
    // const { docId } = router.query; // Extract docId from URL
    const searchParams = useSearchParams();
    let docId = searchParams.get("docId");
    console.log("docId", params?.docId)
    useEffect(() => {
        const fetchDocument = async () => {
            if (!docId) {
                setError("No document number provided.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const token =
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdlNTRlYWZmNzI0OGE2MThjODRiNzciLCJmaXJzdE5hbWUiOiJOaWtoaWwiLCJsYXN0TmFtZSI6IlNpbmdoIiwiZW1haWwiOiJOaWtoaWxAYXRvbW9zdGVjaC5jb20iLCJnSWQiOiI2NzNjMjdmZGJkZGEwOGE1NGU3NDU1ZDkiLCJpYXQiOjE3M3736czM7ryof"

                const response = await fetch(
                    `http://localhost:7071/api/content/getDocumentByDocId/${params}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch document: ${response.statusText}`);
                }

                const result = await response.json();
                if (result?.data) {
                    setDocument(result.data);
                } else {
                    throw new Error("Document not found in the response.");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        if (docId) {
            fetchDocument();
        }

    }, [docId]);  // Adding docId as dependency for fetching when it changes

    if (loading) {
        return <p className="text-center text-blue-500">Loading document...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!document) {
        return <p className="text-center text-gray-500">No document found.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    {document.document_name}
                </h1>
                {/* Render the HTML content */}
                <div
                    className="prose prose-sm max-w-full mx-auto"
                    dangerouslySetInnerHTML={{ __html: document.document }}
                />
                <button
                    // onClick={() => router.back()}
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default Page;
