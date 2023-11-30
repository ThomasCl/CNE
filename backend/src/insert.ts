// import { CosmosClient } from '@azure/cosmos';
// import { CustomError } from './domain/custom-error';

// const cosmosDbConnString = process.env.COSMOS_DB_CONN_STRING || '';
// const cosmosDbName = process.env.COSMOS_DB_NAME || 'll-db';

// const client = new CosmosClient(cosmosDbConnString);
// const database = client.database(cosmosDbName);

// export const insertData = async () => {
//   try {
//     // Create a container for exercise templates
//     const exerciseTemplateContainer = database.container('templates');

//     // Insert Exercise Template
//     await exerciseTemplateContainer.items.create({
//       name: 'Bench Press',
//       group: 'Upper Body',
//     });

//     // Create a container for workouts
//     const workoutContainer = database.container('workouts');

//     // Insert Workout
//     await workoutContainer.items.create({
//       name: 'Chest Day',
//       user: 'example_user',
//     });

//     // Create a container for exercises
//     const exerciseContainer = database.container('exercises');

//     // Insert Exercise
//     await exerciseContainer.items.create({
//       template: {
//         name: 'Bench Press',
//         group: 'Upper Body',
//       },
//       workout: {
//         name: 'Chest Day',
//         user: 'example_user',
//       },
//     });

//     // Create a container for sets
//     const setContainer = database.container('sets');

//     // Insert Set
//     await setContainer.items.create({
//       exercise: {
//         template: {
//           name: 'Bench Press',
//           group: 'Upper Body',
//         },
//         workout: {
//           name: 'Chest Day',
//           user: 'example_user',
//         },
//       },
//       number: 1,
//       weight: 100,
//       reps: 10,
//     });

//     console.log('Data inserted successfully!');
//   } catch (error) {
//     console.error(error);
//     throw CustomError.internal('Error inserting data.');
//   }
// };

// // Run the insertion function
