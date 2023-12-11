// components/WorkoutForm.js
import React, { useState } from 'react';
import axios from 'axios';

const WorkoutForm = ({ setExercises, setSets }) => {
  const [workoutName, setWorkoutName] = useState('');

  const handleCreateWorkout = () => {
    // Send a POST request to create a new workout
    axios.post('http://localhost:8080/workouts', { name: workoutName })
      .then(response => {
        console.log('Workout created:', response.data);
        // Reset exercises and sets when a new workout is created
        setExercises([]);
        setSets([]);
      })
      .catch(error => console.error('Error creating workout:', error));
  };

  return (
    <div>
      <h3>Create Workout</h3>
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />
      <button onClick={handleCreateWorkout}>Create Workout</button>
    </div>
  );
};

export default WorkoutForm;
