import { MongoClient, Collection, Document } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { Workout } from "../domain/workout";

export class MongoWorkoutRepository {

    private static instance: MongoWorkoutRepository;

    private toWorkout(document: Document) {
        return new Workout(document.name, document.user);
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("workout collection is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection("workouts");
            this.instance = new MongoWorkoutRepository(collection);
        }
        return this.instance;
    };

    async createWorkout(workout: Workout): Promise<Workout> {
        const result = await this.collection.insertOne({
            name: workout.name,
            user: workout.user
        });
        if (result && result.acknowledged && result.insertedId) {
            return this.getWorkout(workout.name);
        } else {
            throw CustomError.internal("Could not create workout.");
        }
    }

    async workoutExists(name: string): Promise<boolean> {
        const result = await this.collection.findOne({ name });
        return !!result;
    }

    async getWorkout(name: String): Promise<Workout> {
        const result = await this.collection.findOne({ name });
        if (result) {
            return this.toWorkout(result);
        } else {
            throw CustomError.notFound("Workout not found.");
        }
    }
}