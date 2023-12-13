function handleCreateWorkout() {
  const workoutName = document.getElementById('workoutName').value;

  // Check if workoutName is not empty
  if (workoutName.trim() === '') {
    alert('Please enter a workout name.');
    return;
  }

  // Send a POST request to create a new workout
  fetch('http://localhost:8080/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: workoutName }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Workout created:', data);
      renderWorkouts();
    })
    .catch(error => console.error('Error creating workout:', error));
}