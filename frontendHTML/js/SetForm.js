
function handleCreateSet() {
  // Implement your create set logic here
  const setNumber = document.getElementById('setNumber').value;
  const setWeight = document.getElementById('setWeight').value;
  const setReps = document.getElementById('setReps').value;
  console.log('Set created:', { setNumber, setWeight, setReps });

  // Reset selected exercise when a new set is created
  setSelectedExercise(null);
}

// Additional functions or logic specific to SetForm
