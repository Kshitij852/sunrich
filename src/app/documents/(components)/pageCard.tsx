"use client"; // Mark this as a client component

import React from "react";
import { useRouter } from "next/navigation";

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

interface Page {
    page_no: number;
    page_name: string;
    documents: Document[];
}

interface PageCardProps {
    data: Page[];
}

const PageCard = ({ data }: PageCardProps) => {
    const router = useRouter();

    const renderSingleCard = (document: Document) => {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-xl font-semibold mb-3">{document.document_name}</h3>
                {/* Render the HTML string */}
                <div
                    className="prose prose-sm max-w-full"
                    dangerouslySetInnerHTML={{ __html: document.document }}
                />
                {/* Button to navigate to the document */}
                <button
                    // onClick={() => router.push(`/documents/${document._id}`)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    View Full Document
                </button>
            </div>
        );
    };

    const renderGroupedCard = (groupName: string, documents: Document[]) => {
        console.log("documents", documents)
        return (
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-2xl font-semibold mb-4">{groupName}</h3>
                {documents.map((doc, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-3">
                        <h4 className="text-lg font-semibold mb-2">{doc.document_name}</h4>
                        {/* Render the HTML string */}
                        <div
                            className="prose prose-sm max-w-full"
                            dangerouslySetInnerHTML={{ __html: doc.document }}
                        />

                        {/* Button to navigate to the document */}
                        <button
                            onClick={() => {
                                console.log('Document ID:', doc._id);  // Log the document ID here
                                router.push(`/documents/${doc._id}`);
                            }}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                            View Full Document id
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {data.map((page, pageIndex) => (
                <div key={pageIndex} className="mb-12">
                    {/* Page Title */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        {page.page_name}
                    </h1>

                    {(() => {
                        const groupedDocuments: { [key: string]: Document[] } = {};
                        const standaloneDocuments: Document[] = [];

                        // Group documents by `group_name` or add to standalone list
                        page.documents.forEach((doc) => {
                            if (doc.group_name) {
                                if (!groupedDocuments[doc.group_name]) {
                                    groupedDocuments[doc.group_name] = [];
                                }
                                groupedDocuments[doc.group_name].push(doc);
                            } else {
                                standaloneDocuments.push(doc);
                            }
                        });

                        return (
                            <>
                                {/* Render grouped documents */}
                                {Object.keys(groupedDocuments).map((groupName, groupIndex) => (
                                    <div key={groupIndex}>
                                        {renderGroupedCard(groupName, groupedDocuments[groupName])}
                                    </div>
                                ))}

                                {/* Render standalone documents */}
                                {standaloneDocuments.map((doc) => (
                                    <div key={doc.document_no}>{renderSingleCard(doc)}</div>
                                ))}
                            </>
                        );
                    })()}
                </div>
            ))}
        </div>
    );
};

export default PageCard;
