import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotesList = () => {
    const [noteItems, setNoteItems] = useState([]);

    // Function to retrieve all notes
    const fetchNotes = async () => {
        try {
            const response = await fetch('https://9q63v3ammj.execute-api.us-east-1.amazonaws.com/prod/get-all');
            const result = await response.json();
            const parsedData = JSON.parse(result.body);
            console.log('Fetched Notes:', parsedData);
            setNoteItems(parsedData.notes || []);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    // Function to remove a note by its identifier
    const handleDeleteNote = async (noteId) => {
        try {
            await fetch('https://9q63v3ammj.execute-api.us-east-1.amazonaws.com/prod/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteIdentifier: noteId }),
            });
            fetchNotes(); // Update notes list after deletion
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="container mx-auto p-5 flex flex-col items-center min-h-screen bg-light-gray">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-wide">NoteMe!</h1>
            <Link to={'/create'}>
                <button className="mb-4 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
                    Add New Note
                </button>
            </Link>
            <ul className="w-full max-w-md">
                {noteItems.length > 0 ? (
                    noteItems.map((note, index) => (
                        <div key={note.noteIdentifier} className="bg-white p-5 mb-4 rounded-lg shadow-lg">
                            <h2 className="font-semibold">Note {index + 1}</h2>
                            <p className="text-gray-700">Created On: {new Date(note.createdAt).toLocaleString()}</p>
                            <div className="flex space-x-3 mt-3">
                                <Link to={'/edit'} state={{ noteIdentifier: note.noteIdentifier }}>
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Edit</button>
                                </Link>
                                <Link to={'/view'} state={{ noteIdentifier: note.noteIdentifier }}>
                                    <button className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600">View</button>
                                </Link>
                                <button 
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    onClick={() => handleDeleteNote(note.noteIdentifier)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No notes found.</p>
                )}
            </ul>
        </div>
    );
};

export default NotesList;