import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Diary.css';

const Diary = () => {
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState('');
    const token = localStorage.getItem('token');

    //hook to fetch diary entries
    useEffect(() => {
        if (token) {
            fetchEntries();
        }
    }, [token]);


    const getTodayDate = () => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString(undefined, options);
    };


    //fetch diary entries from the backend
    const fetchEntries = async () => {
        try {
        const response = await axios.get('http://localhost:5000/entries', {
            headers: { Authorization: `Bearer ${token}` } //send the JWT token in the Authorization header
        });
        setEntries(response.data); //update the entries state with the fetched data
        } catch (error) {
        console.error('Error fetching entries:', error);
        alert('Failed to fetch diary entries. Please try again.');
        }
    };

    //add a new diary entry
    const addEntry = async () => {
        if (currentEntry.trim() === "") return; //if adding empty entries just return
        try {
        const response = await axios.post('http://localhost:5000/entries', 
            { text: currentEntry }, //send the entry text in the request body
            { headers: { Authorization: `Bearer ${token}` } } 
        );
        setEntries([...entries, response.data]); //append the new entry to the existing entries
        fetchEntries();
        setCurrentEntry(''); //clear the textarea after adding the entry
        } catch (error) {
        console.error('Error adding entry:', error);
        alert('Failed to add diary entry. Please try again.');
        }
    };

    //delete a specific diary entry by its ID
    const deleteEntry = async (id) => {
        try {
        await axios.delete(`http://localhost:5000/entries/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        //remove the deleted entry from the entries state
        setEntries(entries.filter(entry => entry._id !== id));
        } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete diary entry. Please try again.');
        }
    };

    //prompt user to login if they are not already
    if (!token) {
        return <p>Please log in to view your diary entries.</p>;
    }

  return (
    <div className="diary-container">
        <div className="date-section">
        <h2>{getTodayDate()}</h2>
        </div>
        <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)} //update currentEntry state on input change
            placeholder="Write your thoughts here..."
        />
        <br />
        <button onClick={addEntry}>Add Entry</button>
        <div>
            {entries.map(entry => (
            <div key={entry._id} className="entry">
                <p>{getTodayDate()}  {entry.text}</p><p></p>
                <button onClick={() => deleteEntry(entry._id)}>Delete</button>
                
            </div>
            ))}
        </div>
        </div>
    );

};

export default Diary;