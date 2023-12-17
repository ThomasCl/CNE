// This variable will keep track of the currently selected workout
let selectedWorkout = null;

const renderWorkouts = async () => {
  try {
    const response = await fetch(`${host}/workouts`);
    const workouts = await response.json();

    const workoutListContainer = document.getElementById('workoutList');
    
    // Clear the previous content
    workoutListContainer.innerHTML = '';

    // Render each workout
    workouts.forEach(workout => {
      const workoutItem = document.createElement('li');
      workoutItem.textContent = workout.name;

      // Add a click event listener to each workout item
      workoutItem.addEventListener('click', () => {
        // Remove the 'bold' style from the previously selected workout (if any)
        if (selectedWorkout) {
          selectedWorkout.style.fontWeight = 'normal';
        }

        // Set the new selected workout and apply the 'bold' style
        selectedWorkout = workoutItem;
        workoutItem.style.fontWeight = 'bold';

        // Call the handleWorkoutClick function passing the selected workout
        handleWorkoutClick(workout.name);
      });

      // Append the workout item to the workout list container
      workoutListContainer.appendChild(workoutItem);
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
  }
};

// Call the function to render workouts on page load

const handleWorkoutClick = (workout) => {
  // Call the renderExerciseList function to fetch and render exercises for the selected workout
  console.log("workout click: " + workout)
  renderExerciseList(workout);
  renderSetList()
};


// Call the function to render workouts on page load
renderWorkouts();
