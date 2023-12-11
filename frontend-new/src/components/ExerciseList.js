// components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = ({ workoutName, setExercise, setSelectedWorkout }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for a specific workout
    axios.get(`http://localhost:8080/exercises/workouts/${workoutName}`)
      .then(response => setExercises(response.data))
      .catch(error => {
        console.error('Error fetching exercises:', error);
        // Handle 404 error and reset exercises
        if (error.response && error.response.status === 404) {
          setExercises([]);
        }
      });
  }, [workoutName]);

  useEffect(() => {
    // Reset selected exercise when a new workout is selected
    setExercise(null);
  }, [workoutName, setExercise]);

  return (
    <div>
      <h2>Exercises</h2>
      {exercises.length === 0 ? (
        <p>No exercises have been added yet</p>
      ) : (
        <ul>
          {exercises.map(exercise => (
            <li key={exercise.id} onClick={() => setExercise(exercise)}>
              {exercise.template}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExerciseList;