import { MongoClient, Collection, Document } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { Set } from "../domain/set";
import { Exercise } from "../domain/exercise";

export class MongoSetRepository {

    private static instance: MongoSetRepository;

    private toSet(document: Document) {
        return new Set(
            new Exercise(document.exerciseId, document.exerciseTemplate, document.exerciseWorkout),
            document.number,
            document.weight,
            document.reps
        );
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("set collection is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection("sets");
            this.instance = new MongoSetRepository(collection);
        }
        return this.instance;
    };

    async createSet(set: Set): Promise<Set> {
        const result = await this.collection.insertOne({
            exerciseId: set.exercise.id,
            exerciseTemplate: set.exercise.template,
            exerciseWorkout: set.exercise.workout,
            number: set.number,
            weight: set.weight,
            reps: set.reps
        });
        if (result && result.acknowledged && result.insertedId) {
            return this.getSet(set.exercise.id, set.number);
        } else {
            throw CustomError.internal("Could not create set.");
        }
    }

    async setExists(exerciseId: number, number: number): Promise<boolean> {
        const result = await this.collection.findOne({ exerciseId, number });
        return !!result;
    }

    async getSet(exerciseId: number, number: number): Promise<Set> {
        const result = await this.collection.findOne({ exerciseId, number });
        if (result) {
            return this.toSet(result);
        } else {
            throw CustomError.notFound("Set not found.");
        }
    }
}