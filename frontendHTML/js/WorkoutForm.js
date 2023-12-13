function handleCreateWorkout() {
  // Implement your create workout logic here
  const workoutName = document.getElementById('workoutName').value;
  console.log('Workout created:', workoutName);
  // Reset exercises and sets when a new workout is created
  setExercises([]);
  setSets([]);
}

// Additional functions or logic specific to WorkoutForm
