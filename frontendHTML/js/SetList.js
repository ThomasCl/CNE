// const renderSetList = async (exerciseId) => {
//   try {
//     const response = await fetch(`${host}/sets/${exerciseId}`);
//     if (response.status === 404) {
//       // Handle 404 error (exercise not found for the specified workout)
//       const setListContainer = document.getElementById('setList');
//       setListContainer.innerHTML = '<p>No sets found for this exercise</p>';
//       return;
//     }
//     const sets = await response.json();
//     const setListContainer = document.getElementById('setList');
//     setListContainer.innerHTML = sets.length === 0
//       ? '<p>No sets have been added yet</p>'
//       : sets.map(set => `<li key=${set.id}>${set.number})  Weight: ${set.weight},  Reps: ${set.reps}<button class="btn btn-danger mt-2 delete-button" onclick="handleDeleteSet(${set.id})">Delete</button></li>`).join('');
//           } catch (error) {
//     console.error('Error fetching exercises:', error);
//   }
// };


const renderSetList = async (exerciseId) => {
  try {
    const response = await fetch(`${host}/sets/${exerciseId}`);
    if (response.status === 404) {
      // Handle 404 error (exercise not found for the specified workout)
      const setListContainer = document.getElementById('setList');
      setListContainer.innerHTML = '<p>No sets found for this exercise</p>';
      return;
    }
    const sets = await response.json();
    const setListContainer = document.getElementById('setList');

    if (sets.length === 0) {
      setListContainer.innerHTML = '<p>No sets have been added yet</p>';
    } else {
      // Clear existing items
      setListContainer.innerHTML = '';

      // Loop through each set and append it with a number and a checkbox
      sets.forEach((set, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Create checkbox for the set
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2';
        checkbox.setAttribute('data-set-id', set.id);

        // Set text
        const text = document.createTextNode(`Set ${index + 1}: Weight - ${set.weight}, Reps - ${set.reps}`);

        // Append checkbox and text to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(text);

        // Append the list item to the set list
        setListContainer.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error('Error fetching sets:', error);
  }
};

