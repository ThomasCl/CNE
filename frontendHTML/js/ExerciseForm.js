function handleCreateExercise(template) {
  let exerciseName = "";
  if( template === ''){
     exerciseName = document.getElementById('exerciseName').value;
    }
    else{
      exerciseName = template;
    }
    console.log(exerciseName)
  // Check if exerciseName is not empty
  if (exerciseName.trim() === '') {
    alert('Please enter an exercise name.');
    return;
  }

  // Send a POST request to create a new exercise
  fetch(`${host}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ template: exerciseName, workout: selectedWorkout.textContent }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Exercise created:', data);
      renderExerciseList(selectedWorkout.textContent);
    })
    .catch(error => console.error('Error creating exercise:', error));
}


let exerciseTemplates = []; 
const fetchExerciseTemplates = async () => {
  try {
    // Fetch exercise templates from the server on component mount
    const response = await fetch(`${host}/exercise-templates`);
    exerciseTemplates = await response.json();
  } catch (error) {
    console.error('Error fetching exercise templates:', error);
  }
};
fetchExerciseTemplates();


// Initial rendering of the exercise list
renderExerciseTemplatesList(exerciseTemplates);



function renderExerciseTemplatesList(exercises) {
  const exerciseTemplateListContainer = document.getElementById('exerciseTemplateList');
  exerciseTemplateListContainer.innerHTML = '';

  if (exercises.length === 0) {
    exerciseTemplateListContainer.innerHTML = '<p>No exercises found</p>';
  } else {
    const ul = document.createElement('ul');
    ul.className = 'exercise-list';

    exercises.forEach(exercise => {
      const li = document.createElement('li');
      li.textContent = exercise.name;
      li.addEventListener('click', () =>{
        handleCreateExercise(exercise.name)
      })
      ul.appendChild(li);
    });

    exerciseTemplateListContainer.appendChild(ul);
  }
}
