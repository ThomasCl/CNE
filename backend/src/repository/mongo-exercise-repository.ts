import { MongoClient, Collection, Document } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { Exercise } from "../domain/exercise";

export class MongoExerciseRepository {

    private static instance: MongoExerciseRepository;

    private toExercise(document: Document) {
        return new Exercise(document.id, document.template, document.workout);
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("exercise collection is required.");
        }
    }   

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection("exercises");
            this.instance = new MongoExerciseRepository(collection);
        }
        return this.instance;
    };

    async createExercise(exercise: Exercise): Promise<Exercise> {
        const result = await this.collection.insertOne(exercise);
        if (result && result.acknowledged && result.insertedId) {
            return this.getExercise(exercise.id);
        } else {
            throw CustomError.internal("Could not create exercise.");
        }
    }

    async exerciseExists(name: string): Promise<boolean> {
        const result = await this.collection.findOne({ name });
        return !!result;
    }

    async getExercise(id: number): Promise<Exercise> {
        const result = await this.collection.findOne({ id });
        if (result) {
                return this.toExercise(result)
        } else {
            throw CustomError.notFound("Exercise not found.");
        }
    }
}