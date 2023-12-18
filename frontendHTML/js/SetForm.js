function handleCreateSet() {
  const setNumber = document.getElementById('setNumber').value;
  const setWeight = document.getElementById('setWeight').value;
  const setReps = document.getElementById('setReps').value;

  // Check if any of the fields are empty
  if (setNumber.trim() === '' || setWeight.trim() === '' || setReps.trim() === '') {
    alert('Please enter values for all fields.');
    return;
  }

  if (setExists(selectedExercise.id, setNumber)) {
    updateSet(setNumber, setWeight, setReps);
  } else {
    createSet(setNumber, setWeight, setReps);
  }
}

function createSet(setNumber, setWeight, setReps) {
  // Send a POST request to create a new set
  fetch(`${host}/sets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exerciseId: selectedExercise.id, number: setNumber, weight: setWeight, reps: setReps }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Set created:', data);
      renderSetList(selectedExercise.id);
    })
    .catch(error => console.error('Error creating set:', error));
}

function updateSet(setNumber, setWeight, setReps) {
  // Send a PUT request to create a new set
  fetch(`${host}/exercises/${selectedExercise.id}/set/${setNumber}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ weight: setWeight, reps: setReps }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Set updated:', data);
      renderSetList(selectedExercise.id);
    })
    .catch(error => console.error('Error updating set:', error));
}

async function setExists(exerciseId, setNumber) {
  return await fetch(`${host}/sets/${exerciseId}/${setNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      return data != null;
    })
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