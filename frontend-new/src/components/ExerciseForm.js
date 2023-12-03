// components/ExerciseForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ExerciseForm = ({ workoutName }) => {
  const [exerciseName, setExerciseName] = useState('');

  const handleCreateExercise = () => {
    // Send a POST request to create a new exercise for a specific workout
    axios.post(`http://localhost:3000/exercises`, { template: exerciseName, workout: workoutName })
      .then(response => console.log('Exercise created:', response.data))
      .catch(error => console.error('Error creating exercise:', error));
  };

  return (
    <div>
      <h2>Create Exercise</h2>
      <input
        type="text"
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={(e) => setExerciseName(e.target.value)}
      />
      <button onClick={handleCreateExercise}>Create Exercise</button>
    </div>
  );
};

export default ExerciseForm;
