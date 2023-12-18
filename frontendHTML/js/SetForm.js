function handleCreateSet() {
  const setWeight = document.getElementById('setWeight').value;
  const setReps = document.getElementById('setReps').value;

  // Check if weight and reps fields are empty
  if (setWeight.trim() === '' || setReps.trim() === '') {
    alert('Please enter values for weight and reps.');
    return;
  }

  fetch(`${host}/sets?exerciseId=${selectedExercise.id}`)
    .then(response => response.json())
    .then(sets => {
      // Automatically determine the set number
      const setNumber = sets.length + 1;

      // Send a POST request to create a new set
      fetch(`${host}/sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: selectedExercise.id, number: setNumber, weight: setWeight, reps: setReps })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Set created:', data);
        renderSetList(selectedExercise.id); // Update the set list
      })
      .catch(error => console.error('Error creating set:', error));
    })
    .catch(error => console.error('Error fetching existing sets:', error));
}


function handleDeleteSet(setId) {
  // Replace `setId` with the appropriate identifier for the set

  // Send a DELETE request to delete the set
  fetch(`${host}/sets/${setId}`, {
    method: 'DELETE'
  })
      .then(response => {
        if (response.ok) {
          console.log('Set deleted');
          renderSetList(selectedExercise.id); // Refresh the set list
        } else {
          console.error('Error deleting set');
        }
      })
      .catch(error => console.error('Error:', error));
}

function handleDeleteSelectedSets() {
  const setList = document.getElementById('setList');
  const selectedSets = setList.querySelectorAll('input[type="checkbox"]:checked');
  
  selectedSets.forEach(setCheckbox => {
    const setId = setCheckbox.getAttribute('data-set-id'); // Assuming each checkbox has a data attribute for the set ID

    // Send a DELETE request to delete the set
    fetch(`${host}/sets/${setId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Set deleted');
          setCheckbox.closest('li').remove(); // Remove the set item from the list
          renderSetList(selectedExercise.id); // Refresh the set list
          renderExerciseList(); // Refresh the exercise list
        } else {
          console.error('Error deleting set');
        }
      })
      .catch(error => console.error('Error:', error));
  });
}
