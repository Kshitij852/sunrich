import React from 'react';

// Interfaces
interface Document {
    document_no: number;
    document_name: string;
    document: string; // HTML content as a string
}

interface Layer {
    group_no?: number; // Optional for grouped layers
    group_name?: string; // Name of the group (only for grouped layers)
    content?: Document[]; // Array of documents (only for grouped layers)
    document_no?: number; // Optional for standalone layers
    document_name?: string; // Name of the standalone document
    document?: string; // Content of the standalone document
}

interface PageData {
    _id: string;
    projectId: string;
    page_no: number;
    page_name: string;
    layers: Layer[]; // Array of layers (can be grouped or standalone)
}

// Component
const PageCard = ({ data }: { data: PageData | PageData[] }) => {
    // Ensure data is always an array
    const dataArray = Array.isArray(data) ? data : [data];

    // Function to render a single document card
    const renderSingleCard = (document: Document) => {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-xl font-semibold mb-3">{document.document_name}</h3>
                {/* Render the HTML string */}
                <div className="prose prose-sm max-w-full" dangerouslySetInnerHTML={{ __html: document.document }} />
            </div>
        );
    };

    // Function to render a grouped card
    const renderGroupedCard = (layer: Layer) => {
        return (
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-2xl font-semibold mb-4">{layer.group_name}</h3>
                {layer.content?.map((doc, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-3">
                        <h4 className="text-lg font-semibold mb-2">{doc.document_name}</h4>
                        {/* Render the HTML string */}
                        <div className="prose prose-sm max-w-full" dangerouslySetInnerHTML={{ __html: doc.document }} />
                    </div>
                ))}
            </div>
        );
    };

    // Main render
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {dataArray.map((page, pageIndex) => (
                <div key={pageIndex} className="mb-12">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{page.page_name}</h1>

                    {page.layers.map((layer, layerIndex) => {
                        // Render grouped layers with `group_name` and `content`
                        if (layer.group_name && layer.content) {
                            return <div key={layerIndex}>{renderGroupedCard(layer)}</div>;
                        }

                        // Render standalone layers with `document_name` and `document`
                        if (!layer.group_name && layer.document_name && layer.document) {
                            return (
                                <div key={layer.document_no}>
                                    {renderSingleCard({
                                        document_no: layer.document_no!,
                                        document_name: layer.document_name,
                                        document: layer.document,
                                    })}
                                </div>
                            );
                        }

                        return null; // Skip invalid layers
                    })}
                </div>
            ))}
        </div>
    );
};

export default PageCard;
