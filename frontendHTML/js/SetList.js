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

//     if (sets.length === 0) {
//       setListContainer.innerHTML = '<p>No sets have been added yet</p>';
//     } else {
//       // Clear existing items
//       setListContainer.innerHTML = '';

//       // Loop through each set and append it with a number and a checkbox
//       sets.forEach((set, index) => {
//         const listItem = document.createElement('li');
//         listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

//         // Create checkbox for the set
//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         checkbox.className = 'form-check-input me-2';
//         checkbox.setAttribute('data-set-id', set.id);

//         // Set text
//         const text = document.createTextNode(`Set ${index + 1}: Weight - ${set.weight}, Reps - ${set.reps}`);

//         // Append checkbox and text to the list item
//         listItem.appendChild(checkbox);
//         listItem.appendChild(text);

//         // Append the list item to the set list
//         setListContainer.appendChild(listItem);
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching sets:', error);
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

      // Loop through each set and append an editable input field for each value
      sets.forEach((set, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Create input fields for weight and reps
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2';
        checkbox.setAttribute('data-set-id', set.id);


        const setNumberText = document.createTextNode(`${set.number}:`);
        const weightInput = createInputField('Weight', set.weight);
        const repsInput = createInputField('Reps', set.reps);

        // Create "Save" button to update the set
        const saveButton = document.createElement('button');
        saveButton.className = 'btn btn-success';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => handleSaveSet(set.exercise,set.number, weightInput.value, repsInput.value));

        // Append input fields and the "Save" button to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(setNumberText);
        listItem.appendChild(weightInput);
        listItem.appendChild(repsInput);
        listItem.appendChild(saveButton);

        // Append the list item to the set list
        setListContainer.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error('Error fetching sets:', error);
  }
};

// Helper function to create an input field
function createInputField(label, value) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control me-2';
  input.value = value;

  const labelElement = document.createElement('label');
  labelElement.textContent = label;

  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-group mb-3';
  inputContainer.appendChild(labelElement);
  inputContainer.appendChild(input);

  return inputContainer;
}

// Handler function for saving a set
// Handler function for saving a set
async function handleSaveSet(exerciseId, setNumber, newWeight, newReps) {
  try {
    const updateSetEndpoint = `${host}/exercises/${exerciseId}/set/${setNumber}/edit`;
    console.log(updateSetEndpoint)
    // Make a PUT request to the API endpoint to update the set
    const response = await fetch(updateSetEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weight: newWeight, reps: newReps }),
    });

    if (response.status === 200) {
      console.log('Set updated successfully');
      // You may want to refresh the set list after a successful update
      // Uncomment the line below if needed:
      // renderSetList(exerciseId);
    } else {
      console.error('Failed to update set. Status:', response.status);
    }
  } catch (error) {
    console.error('Error updating set:', error);
  }
}

