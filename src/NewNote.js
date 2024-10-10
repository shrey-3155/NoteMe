import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewNote = () => {
    const navigate = useNavigate();
    const [noteContent, setNoteContent] = useState('');

    // Function to submit the note
    const handleNoteSubmission = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://9q63v3ammj.execute-api.us-east-1.amazonaws.com/prod/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: noteContent })
            });

            const result = await response.json();

            if (response.ok) {
                navigate('/');
            } else {
                console.error('Failed to create note:', result);
                alert('Failed to create note: ' + result.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error: Please try again later.');
        }
    };

    return (
        <div className="container mx-auto p-5 flex justify-center items-center min-h-screen bg-light-gray">
            <form onSubmit={handleNoteSubmission} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Add a New Note</h2>
                <textarea
                    rows="6"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Type your note here..."
                ></textarea>
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">Save Note</button>
                    <Link to="/">
                        <button type="button" className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700">Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default NewNote;
