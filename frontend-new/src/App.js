// App.js
import React, { useState } from 'react';
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
          <ExerciseForm workoutId={selectedWorkout.id} />

          <ExerciseList workoutId={selectedWorkout.id} setExercise={setSelectedExercise} />
        </div>
      )}

      {selectedExercise && (
        <><SetForm exerciseId={selectedExercise.id} />
        <SetList exerciseId={selectedExercise.id} /></>
      )}
    </div>
  );
}

export default App;
