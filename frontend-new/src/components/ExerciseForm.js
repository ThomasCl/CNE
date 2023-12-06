// components/ExerciseForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseForm = ({ workoutName }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseTemplates, setExerciseTemplates] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [createdExercise, setCreatedExercise] = useState(null);

  useEffect(() => {
    const fetchExerciseTemplates = async () => {
      try {
        // Fetch exercise templates from the server on component mount
        const response = await axios.get(`http://localhost:8080/exercise-templates`);
        setExerciseTemplates(response.data);
      } catch (error) {
        console.error('Error fetching exercise templates:', error);
      }
    };

    // Call the function to fetch exercise templates
    fetchExerciseTemplates();
  }, []);

  useEffect(() => {
    const handleCreateExercise = async () => {
      try {
        // Send a POST request to create a new exercise for a specific workout
        const response = await axios.post(`http://localhost:8080/exercises`, { template: exerciseName, workout: workoutName });
        setCreatedExercise(response.data);
      } catch (error) {
        console.error('Error creating exercise:', error);
      }
    };

    // Call the function to create exercise whenever exerciseName changes
    if (exerciseName.trim() !== '') {
      handleCreateExercise();
    }
  }, [exerciseName, workoutName]);

  useEffect(() => {
    // This effect will run whenever createdExercise changes
    if (createdExercise) {
      console.log('Exercise created:', createdExercise);

      // Add any additional side effects you want to perform
      // ...

      // Reset the createdExercise state after handling the side effects
      setCreatedExercise(null);
    }
  }, [createdExercise]);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Filter exercise templates based on the search term
    const filteredTemplates = exerciseTemplates.filter(template =>
      template.name.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filteredTemplates.slice(0, 10)); // Display up to 10 results
    setExerciseName(searchTerm);
    setSelectedTemplate(null); // Reset selected template
  };

  const handleTemplateSelect = (template) => {
    // Set the selected template and autofill the input field
    setSelectedTemplate(template);
    setExerciseName(template.name);
    setSearchResults([]); // Clear search results
  };

  return (
    <div>
      <h2>Create Exercise</h2>
      <input
        type="text"
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={handleSearchChange}
      />
      {searchResults.length > 0 && (
        <ul style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc' }}>
          {searchResults.map((result, index) => (
            <li key={index} onClick={() => handleTemplateSelect(result)}>
              {result.name}
            </li>
          ))}
        </ul>
      )}
      {selectedTemplate && (
        <div>
          <p>Selected Template: {selectedTemplate.name}</p>
        </div>
      )}
      {createdExercise && (
        <div>
          <p>Exercise created: {createdExercise.name}</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseForm;
