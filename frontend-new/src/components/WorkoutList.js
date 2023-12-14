// components/WorkoutList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutList = ({ setWorkout, setExercises, setSets }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    // Fetch workouts from your backend
    axios.get('http://localhost:8080/workouts')
      .then(response => setWorkouts(response.data))
      .catch(error => console.error('Error fetching workouts:', error));
  }, [setExercises, setSets]);

  useEffect(() => {
    // Reset exercises and sets when a new workout is selected
    setExercises([]);
    setSets([]);
  }, [setExercises, setSets, setWorkout]);

  const handleWorkoutClick = (workout) => {
    // Set the selected workout
    setSelectedWorkout(workout);
    // Call the setWorkout function to communicate the selected workout to the parent component
    setWorkout(workout);
  };

  return (
    <div>
      <h3>Workouts</h3>
      <ul>
        {workouts.map(workout => (
          <li
            key={workout.name}
            onClick={() => handleWorkoutClick(workout)}
            style={{ fontWeight: selectedWorkout && selectedWorkout.name === workout.name ? 'bold' : 'normal' }}
          >
            {workout.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutList;