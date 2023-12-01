// components/WorkoutList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Fetch workouts from your backend
    axios.get('http://localhost:3000/workouts')
      .then(response => setWorkouts(response.data))
      .catch(error => console.error('Error fetching workouts:', error));
  }, []);

  return (
    <div>
      <h2>Workouts</h2>
      <ul>
        {workouts.map(workout => (
          <li key={workout.id}>{workout.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutList;
