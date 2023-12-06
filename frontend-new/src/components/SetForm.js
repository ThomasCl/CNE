// components/SetForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SetForm = ({ exercise, setSelectedExercise }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [number, setNumber] = useState('');

  const handleCreateSet = () => {
    // Send a POST request to create a new set for a specific exercise
    console.log(exercise);
    let exerciseName = exercise.template;
    let workoutName = exercise.workout;
    axios.post(`http://localhost:8080/sets`, { exerciseName, workoutName, number, weight, reps })
      .then(response => {
        console.log('Set created:', response.data);
        // Reset selected exercise when a new set is created
        setSelectedExercise(null);
      })
      .catch(error => console.error('Error creating set:', error));
  };

  return (
    <div>
      <h2>Create Set</h2>
      <input
        type="text"
        placeholder="SetNumber"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
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

