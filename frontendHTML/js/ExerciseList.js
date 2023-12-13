const renderExerciseList = async (workoutName) => {
  try {
    const response = await fetch(`http://localhost:8080/exercises/workouts/${workoutName}`);
    if (response.status === 404) {
      // Handle 404 error (exercise not found for the specified workout)
      const exerciseListContainer = document.getElementById('exerciseList');
      exerciseListContainer.innerHTML = '<p>No exercises found for this workout</p>';
      return;
    }
    const exercises = await response.json();
    const exerciseListContainer = document.getElementById('exerciseList');
    exerciseListContainer.innerHTML = exercises.length === 0
      ? '<p>No exercises have been added yet</p>'
      : exercises.map(exercise => `<li onclick="handleExerciseClick('${exercise.id}')">${exercise.template}</li>`).join('');
          } catch (error) {
    console.error('Error fetching exercises:', error);
  }
};



const handleExerciseClick = (exerciseId) => {
  // Call the renderExerciseList function to fetch and render exercises for the selected workout
  renderSetList(exerciseId);
};