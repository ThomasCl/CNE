import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });

const insertData = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("ll-db");
    
    // Insert Exercise Template
    await db.collection("exercise_templates").insertOne({
      name: "Bench Press",
      group: "Upper Body"
    });

    // Insert Workout
    await db.collection("workouts").insertOne({
      name: "Chest Day",
      user: "example_user"
    });

    // Insert Exercise
    await db.collection("exercises").insertOne({
      id: 1,
      template: {
        name: "Bench Press",
        group: "Upper Body"
      },
      workout: {
        name: "Chest Day",
        user: "example_user"
      }
    });

    // Insert Set
    await db.collection("sets").insertOne({
      exercise: {
        id: 1,
        template: {
          name: "Bench Press",
          group: "Upper Body"
        },
        workout: {
          name: "Chest Day",
          user: "example_user"
        }
      },
      number: 1,
      weight: 100,
      reps: 10
    });

    console.log("Data inserted successfully!");
  } finally {
    await mongoClient.close();
  }
};

// Run the insertion function
insertData();
