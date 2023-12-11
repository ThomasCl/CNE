// components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = ({ workoutName, setExercise, setSelectedWorkout }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

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
    setSelectedExercise(null);
  }, [workoutName, setSelectedExercise]);

  return (
    <div>
      <h3>Exercises</h3>
      {exercises.length === 0 ? (
        <p>No exercises have been added yet</p>
      ) : (
        <ul>
          {exercises.map(exercise => (
            <li
              key={exercise.id}
              onClick={() => {
                setExercise(exercise);
                setSelectedExercise(exercise);
              }}
              style={{ fontWeight: selectedExercise && selectedExercise.id === exercise.id ? 'bold' : 'normal' }}
            >
              {exercise.template}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExerciseList;
