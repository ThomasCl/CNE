// workoutlist.js
async function renderWorkouts() {
  try {
    const response = await fetch('http://localhost:8080/workouts');
    const workouts = await response.json();

    const workoutListContainer = document.getElementById('workoutList');
    workoutListContainer.innerHTML = workouts.map(workout => `<li onclick="handleWorkoutClick('${workout.name}')">${workout.name}</li>`).join('');
  } catch (error) {
    console.error('Error fetching workouts:', error);
  }
}

const handleWorkoutClick = (workout) => {
  // Call the renderExerciseList function to fetch and render exercises for the selected workout
  renderExerciseList(workout);
};


// Call the function to render workouts on page load
renderWorkouts();
