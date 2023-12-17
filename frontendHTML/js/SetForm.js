function handleCreateSet() {
  const setNumber = document.getElementById('setNumber').value;
  const setWeight = document.getElementById('setWeight').value;
  const setReps = document.getElementById('setReps').value;

  // Check if any of the fields are empty
  if (setNumber.trim() === '' || setWeight.trim() === '' || setReps.trim() === '') {
    alert('Please enter values for all fields.');
    return;
  }

  // Send a POST request to create a new set
  fetch(`${host}/sets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exerciseId: selectedExercise.id, number:setNumber, weight:setWeight, reps:setReps }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Set created:', data);
      renderSetList(selectedExercise.id);
    })
    .catch(error => console.error('Error creating set:', error));
}