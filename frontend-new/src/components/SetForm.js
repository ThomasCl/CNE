// components/SetForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SetForm = ({ exerciseId }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleCreateSet = () => {
    // Send a POST request to create a new set for a specific exercise
    axios.post(`http://localhost:3000/exercises/${exerciseId}/sets`, { weight, reps })
      .then(response => console.log('Set created:', response.data))
      .catch(error => console.error('Error creating set:', error));
  };

  return (
    <div>
      <h2>Create Set</h2>
      <input
        type="text"
        placeholder="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <input
        type="text"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <button onClick={handleCreateSet}>Create Set</button>
    </div>
  );
};

export default SetForm;
