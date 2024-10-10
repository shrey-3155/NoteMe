import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";

const NoteDetail = () => {
    const { state } = useLocation();
    const [noteContent, setNoteContent] = useState('');
    const [noteId, setNoteId] = useState(state.noteIdentifier);

    const retrieveNote = async () => {
        try {
            const response = await fetch('https://9q63v3ammj.execute-api.us-east-1.amazonaws.com/prod/get-one', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteIdentifier: noteId }),
            });
            const result = await response.json();
            const parsedData = JSON.parse(result.body);
            setNoteContent(parsedData.text);
        } catch (error) {
            console.error('Error fetching note:', error);
        }
    };

    useEffect(() => {
        retrieveNote();
    }, []);

    return (
        <div className="container mx-auto p-5 flex justify-center items-center min-h-screen bg-light-gray">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Note Details</h2>
                <textarea
                    rows="5"
                    value={noteContent}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-gray-100"
                ></textarea>
                <div className="flex justify-end">
                    <Link to={'/'}>
                        <button type="button" className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700">Close</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NoteDetail;
