import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const ModifyNote = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [noteContent, setNoteContent] = useState('');
    const [noteId, setNoteId] = useState(state.noteIdentifier);

    // Function to retrieve the note based on noteId
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

    // Function to submit updated note
    const handleUpdateNote = async (event) => {
        event.preventDefault();
        try {
            await fetch('https://9q63v3ammj.execute-api.us-east-1.amazonaws.com/prod/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteIdentifier: noteId, text: noteContent }),
            });
            navigate('/'); 
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div className="container mx-auto p-5 flex justify-center items-center min-h-screen bg-light-gray">
            <form onSubmit={handleUpdateNote} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Edit Your Note</h2>
                <textarea
                    rows="6"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Make your changes here..."
                ></textarea>
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
                    <Link to="/">
                        <button type="button" className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700">Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ModifyNote;
