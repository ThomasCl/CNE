const renderSetList = async (exerciseId) => {
  try {
    const response = await fetch(`http://localhost:8080/sets/${exerciseId}`);
    if (response.status === 404) {
      // Handle 404 error (exercise not found for the specified workout)
      const setListContainer = document.getElementById('setList');
      setListContainer.innerHTML = '<p>No sets found for this exercise</p>';
      return;
    }
    const sets = await response.json();
    const setListContainer = document.getElementById('setList');
    setListContainer.innerHTML = sets.length === 0
      ? '<p>No sets have been added yet</p>'
      : sets.map(set => `<li key=${set.id}>${set.number})  Weight: ${set.weight},  Reps: ${set.reps}</li>`).join('');
          } catch (error) {
    console.error('Error fetching exercises:', error);
  }
};