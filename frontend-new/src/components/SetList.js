import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetList = ({ exercise }) => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    // Fetch sets for a specific exercise
    axios.get(`http://localhost:8080/sets/${exercise.id}`)
      .then(response => setSets(response.data))
      .catch(error => {
        console.error('Error fetching sets:', error);
        // Handle 404 error and reset sets
        if (error.response && error.response.status === 404) {
          setSets([]);
        }
      });
  }, [exercise.id]);

  return (
    <div>
      <h2>Sets</h2>
      {sets.length === 0 ? (
        <p>No sets have been added yet</p>
      ) : (
        <ul>
          {sets.map(set => (
            <li key={set.id}>{`${set.number} Weight: ${set.weight}, Reps: ${set.reps}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SetList;