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

      // Create table structure
      const table = document.createElement('table');
      table.className = 'table table-bordered table-striped';

      // Create table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th scope="col" class="text-center">DELETE</th>
          <th scope="col" class="text-center">SET</th>
          <th scope="col" class="text-center">WEIGHT</th>
          <th scope="col" class="text-center">REPS</th>
          <th scope="col" class="text-center">SAVE</th>
        </tr>
      `;
      table.appendChild(thead);

      // Create table body
      const tbody = document.createElement('tbody');

      // Loop through each set and create table rows
      sets.forEach((set) => {
        const row = document.createElement('tr');

        // Create checkbox for deletion
        const deleteCell = document.createElement('td');
        deleteCell.className = 'text-center';
        const deleteCheckbox = document.createElement('input');
        deleteCheckbox.type = 'checkbox';
        deleteCheckbox.className = 'form-check-input';
        deleteCheckbox.setAttribute('data-set-id', set.id);
        deleteCell.appendChild(deleteCheckbox);

        // Create set number cell
        const setNumberCell = document.createElement('td');
        setNumberCell.className = 'text-center';
        setNumberCell.textContent = set.number;

        // Create weight input cell
        const weightCell = document.createElement('td');
        weightCell.className = 'text-center';
        const weightInput = createInputField('', set.weight);
        weightCell.appendChild(weightInput);

        // Create reps input cell
        const repsCell = document.createElement('td');
        repsCell.className = 'text-center';
        const repsInput = createInputField('', set.reps);
        repsCell.appendChild(repsInput);

        // Create "Save" button cell
        const saveCell = document.createElement('td');
        saveCell.className = 'text-center';
        const saveButton = document.createElement('button');
        saveButton.className = 'btn btn-primary mt-2 w-100';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () =>
          handleSaveSet(set.exercise, set.number, weightInput.querySelector('input').value, repsInput.querySelector('input').value)
        );
        saveCell.appendChild(saveButton);

        // Append cells to the row
        row.appendChild(deleteCell);
        row.appendChild(setNumberCell);
        row.appendChild(weightCell);
        row.appendChild(repsCell);
        row.appendChild(saveCell);

        // Append row to table body
        tbody.appendChild(row);
      });

      table.appendChild(tbody);

      // Append table to the set list container
      setListContainer.appendChild(table);
    }
  } catch (error) {
    console.error('Error fetching sets:', error);
  }
};



// Helper function to create an input field
function createInputField(label, value) {
  const input = document.createElement('input');
  input.type = 'number';
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

