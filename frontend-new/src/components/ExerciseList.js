// components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = ({ workoutId }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for a specific workout
    axios.get(`http://localhost:3000/workouts/${workoutId}/exercises`)
      .then(response => setExercises(response.data))
      .catch(error => console.error('Error fetching exercises:', error));
  }, [workoutId]);

  return (
    <div>
      <h2>Exercises</h2>
      <ul>
        {exercises.map(exercise => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
