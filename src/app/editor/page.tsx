"use client";
import React, { useEffect, useState } from "react";
import suneditor from "suneditor";
import plugins from "suneditor/src/plugins";
import { en } from "suneditor/src/lang";
import "suneditor/dist/css/suneditor.min.css";

const EditorPage = ({ editorId }: { editorId: string }) => {
    const [content, setContent] = useState<string>(""); // Content to populate the editor
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const editorRef = React.createRef<HTMLTextAreaElement>();
    let editorInstance: any;

    // Fetch content from the backend API
    const fetchContent = async (id: string) => {
        try {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdlNTRlYWZmNzI0OGE2MThjODRiNzciLCJmaXJzdE5hbWUiOiJOaWtoaWwiLCJsYXN0TmFtZSI6IlNpbmdoIiwiZW1haWwiOiJOaWtoaWxAYXRvbW9zdGVjaC5jb20iLCJnSWQiOiI2NzNjMjdmZGJkZGEwOGE1NGU3NDU1ZDkiLCJpYXQiOjE3MzcwMDA4MjEsImV4cCI6MTczNzA4NzIyMX0.tlj-yJVw8_0mTV8r9bsHGoc1tPBxB3V4BPd8K3WlYgY'
            const response = await fetch(`http://localhost:7071/api/content/getProjectContentByProjectId/677e5536ff7248a618c84b81`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch editor content");
            }
            const data = await response.json();
            if (data) {
                console.log("all data", data)
                console.log("data", data.data[2].layers[1])
                return data.data[2].layers[1].document; // Access the content if it exists
            } else {
                console.warn("No content found in layers[0].document");
                return ""; // Return empty string if no document found
            }
        } catch (error) {
            console.error("Error fetching content:", error);
            return "";
        }
    };

    // Save content to the backend API
    const saveContent = async (id: string, updatedContent: string) => {
        try {
            const response = await fetch(`https://api.example.com/editor/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: updatedContent }),
            });
            if (!response.ok) {
                throw new Error("Failed to save content");
            }
            alert("Content saved successfully!");
        } catch (error) {
            alert("Failed to save content!");
            console.error("Error saving content:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchContent(editorId);
                console.log("data 1", data)
                if (data) {
                    setContent(data); // Set content once API data is fetched
                } else {
                    console.warn("No content found in API response");
                    setContent(""); // Fallback if no content is found
                }
            } catch (error) {
                console.error("Error fetching editor content:", error);
                setContent("");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [editorId]);


    useEffect(() => {
        if (!loading && editorRef.current) {
            // Initialize SunEditor
            editorInstance = suneditor.create(editorRef.current, {
                plugins,
                lang: en,
                width: "100%",
                height: "auto",
                minHeight: "400px",
                buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    ["bold", "underline", "italic", "strike"],
                    ["fontColor", "hiliteColor", "textStyle"],
                    ["removeFormat"],
                    ["outdent", "indent"],
                    ["align", "horizontalRule", "list", "lineHeight"],
                    ["table", "link", "image", "video"],
                    ["fullScreen", "showBlocks", "codeView"],
                    ["preview"],
                    ["save"],
                ],
                callBackSave: (updatedContent: string) => handleSave(updatedContent),
            });

            // Set the editor content after initialization
            if (content) {
                editorInstance.setContents(content);
            }
        }

        return () => {
            if (editorInstance) editorInstance.destroy();
        };
    }, [loading]);


    const handleSave = async (updatedContent: string) => {
        await saveContent(editorId, updatedContent);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Editor Page</h1>
            <textarea ref={editorRef} />
        </div>
    );
};

export default EditorPage;
