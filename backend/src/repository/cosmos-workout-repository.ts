import { CosmosClient } from '@azure/cosmos';
import { CustomError } from '../domain/custom-error';
import { Workout } from '../domain/workout';

export class CosmosWorkoutRepository {
    private static instance: CosmosWorkoutRepository;

    private toWorkout(document: any) {
        return new Workout(document.name);
    }

    constructor(private readonly container: any) {
        if (!container) {
            throw new Error('workout container is required.');
        }
    }

    static async getInstance() {
        if (!this.instance) {
            const cosmosDbConnString = process.env.COSMOS_DB_CONN_STRING || '';
            const cosmosDbName = process.env.COSMOS_DB_NAME || 'll-db';
            const containerId = 'workouts';

            const client = new CosmosClient(cosmosDbConnString);
            const database = client.database(cosmosDbName);
            const container = database.container(containerId);

            this.instance = new CosmosWorkoutRepository(container);
        }
        return this.instance;
    }

    async createWorkout(workout: Workout): Promise<Workout> {
        const result = await this.container.items.create({
            name: workout.name,
        });

        if (result && result.statusCode === 201) {
            return this.getWorkout(workout.name);
        } else {
            throw CustomError.internal('Could not create workout.');
        }
    }

    async workoutExists(name: string): Promise<boolean> {
        const query = `SELECT * FROM c WHERE c.name = "${name}"`;
        const { resources } = await this.container.items.query(query).fetchAll();
        return resources.length > 0;
    }

    async getWorkout(name: string): Promise<Workout> {
        const query = `SELECT * FROM c WHERE c.name = "${name}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toWorkout(resources[0]);
        } else {
            throw CustomError.notFound('Workout not found.');
        }
    }
}
