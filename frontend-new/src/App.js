// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WorkoutList from './components/WorkoutList';
import ExerciseList from './components/ExerciseList';
import SetList from './components/SetList';
import WorkoutForm from './components/WorkoutForm';
import ExerciseForm from './components/ExerciseForm';
import SetForm from './components/SetForm';

function App() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [sets, setSets] = useState([]);

  return (
    <Router>
      <div>
        <WorkoutForm setExercises={setExercises} setSets={setSets} />
        <WorkoutList setWorkout={setSelectedWorkout} setExercises={setExercises} setSets={setSets} />

        {selectedWorkout && (
          <div>
            <ExerciseForm workoutName={selectedWorkout.name} setExercises={setExercises} />
            <ExerciseList workoutName={selectedWorkout.name} setExercise={setSelectedExercise} setSelectedWorkout={setSelectedWorkout} />
          </div>
        )}

        {selectedExercise && (
          <div>
            <SetForm exercise={selectedExercise} setSelectedExercise={setSelectedExercise} />
            <SetList exercise={selectedExercise} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;