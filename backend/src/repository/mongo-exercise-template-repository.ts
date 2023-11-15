import { MongoClient, Collection, Document } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { Exercise_template } from "../domain/exercise-template";

export class MongoExerciseTemplateRepository {

    private static instance: MongoExerciseTemplateRepository;

    private toTemplate(document: Document) {
        return new Exercise_template(document.name, document.group);
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("template collection is required.");
        }
    }   

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection("exercise_templates");
            this.instance = new MongoExerciseTemplateRepository(collection);
        }
        return this.instance;
    };

    async createTemplate(template: Exercise_template): Promise<Exercise_template> {
        const result = await this.collection.insertOne(template);
        if (result && result.acknowledged && result.insertedId) {
            return this.getTemplate(template.name);
        } else {
            throw CustomError.internal("Could not create template.");
        }
    }

    async templateExists(name: string): Promise<boolean> {
        const result = await this.collection.findOne({ name });
        return !!result;
    }

    async getTemplate(name: string): Promise<Exercise_template> {
        const result = await this.collection.findOne({ name });
        if (result) {
                return this.toTemplate(result)
        } else {
            throw CustomError.notFound("Template not found.");
        }
    }
}