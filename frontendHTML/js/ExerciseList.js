// This variable will keep track of the currently selected exercise
let selectedExercise = null;

const renderExerciseList = async (workoutName) => {
  try {
    const response = await fetch(`http://localhost:8080/exercises/workouts/${workoutName}`);
    const exercises = await response.json();

    const exerciseListContainer = document.getElementById('exerciseList');
    
    // Clear the previous content
    exerciseListContainer.innerHTML = exercises.length === 0
      ? '<p>No exercises have been added yet</p>'
      : '<ul></ul>';

    const exerciseList = exerciseListContainer.querySelector('ul');

    exercises.forEach(exercise => {
      const exerciseItem = document.createElement('li');
      exerciseItem.textContent = exercise.template;
      exerciseItem.id = exercise.id;

      // Add a click event listener to each exercise item
      exerciseItem.addEventListener('click', () => {
        // Remove the 'bold' style from the previously selected exercise (if any)
        if (selectedExercise) {
          selectedExercise.style.fontWeight = 'normal';
        }

        // Set the new selected exercise and apply the 'bold' style
        selectedExercise = exerciseItem;
        exerciseItem.style.fontWeight = 'bold';

        // Call the handleExerciseClick function passing the selected exercise
        handleExerciseClick(exercise.id);
      });

      // Append the exercise item to the exercise list
      exerciseList.appendChild(exerciseItem);
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
};

const handleExerciseClick = (exerciseId) => {
  // Call the renderExerciseList function to fetch and render exercises for the selected workout
  renderSetList(exerciseId);
};