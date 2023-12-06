// components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = ({ workoutName, setExercise }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for a specific workout
    axios.get(`http://localhost:8080/exercises/workouts/${workoutName}`)
      .then(response => setExercises(response.data))
      .catch(error => console.error('Error fetching exercises:', error));
  }, [workoutName]);

  return (
    <div>
      <h2>Exercises</h2>
      <ul>
        {exercises.map(exercise => (
          <li key={exercise.id} onClick={() => setExercise(exercise)}>{exercise.template}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
