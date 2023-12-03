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

  return (
    <div>
      <WorkoutForm />

      <WorkoutList setWorkout={setSelectedWorkout} />

      {selectedWorkout && (
        <div>
          <ExerciseForm workoutName={selectedWorkout.name} />

          <ExerciseList workoutName={selectedWorkout.name} setExercise={setSelectedExercise} />
        </div>
      )}

      {selectedExercise && (
        <><SetForm exercise={selectedExercise} />
        <SetList exercise={selectedExercise} /></>
      )}
    </div>
  );
}

export default App;
