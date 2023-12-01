// components/SetList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetList = ({ exerciseId }) => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    // Fetch sets for a specific exercise
    axios.get(`http://localhost:3000/exercises/${exerciseId}/sets`)
      .then(response => setSets(response.data))
      .catch(error => console.error('Error fetching sets:', error));
  }, [exerciseId]);

  return (
    <div>
      <h2>Sets</h2>
      <ul>
        {sets.map(set => (
          <li key={set.id}>{`Weight: ${set.weight}, Reps: ${set.reps}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default SetList;
