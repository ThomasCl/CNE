import { CosmosClient } from '@azure/cosmos';
import { CustomError } from "../domain/custom-error";
import { Exercise } from "../domain/exercise";
import { config } from 'dotenv';

export class CosmosExerciseRepository {

    private static instance: CosmosExerciseRepository;

    private toExercise(document: any) {
        return new Exercise(document.id, document.template, document.workout);
    }

    constructor(private readonly container: any) {
        if (!container) {
            throw new Error('exercise container is required.');
        }
    }

    static async getInstance() {
        if (!this.instance) {
            config();
            const endpoint = process.env.COSMOS_DB_ENDPOINT;
            const key = process.env.COSMOS_DB_KEY;
            const cosmosDbName = process.env.COSMOS_DB_NAME || 'db';
            const containerId = 'exercises';
            if(endpoint == undefined || key == undefined){
                throw new Error('Cosmos DB connection string is not defined.');
            }
            const client = new CosmosClient({endpoint,key});
            const database = client.database(cosmosDbName);
            const container = database.container(containerId);

            this.instance = new CosmosExerciseRepository(container);
        }
        return this.instance;
    };

    async createExercise(exercise: Exercise): Promise<Exercise> {
        const result = await this.container.items.create({
            id: exercise.id,
            template: exercise.template,
            workout: exercise.workout
        });
        if (result && result.acknowledged && result.insertedId) {
            return this.getExercise(exercise.id);
        } else {
            throw CustomError.internal("Could not create exercise.");
        }
    }

    // async exerciseExists(name: string): Promise<boolean> {
    //     const result = await this.collection.findOne({ name });
    //     return !!result;
    // }

    async getExercise(id: number): Promise<Exercise> {
        const query = `SELECT * FROM c WHERE c.id = "${id}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toExercise(resources[0]);
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }
}