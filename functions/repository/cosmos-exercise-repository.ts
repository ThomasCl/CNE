import { CosmosClient } from '@azure/cosmos';
import { CustomError } from "../domain/custom-error";
import { Exercise, SimpleExercise } from "../domain/exercise";
import { config } from 'dotenv';
import { Exercise_template } from '../domain/exercise-template';
import { Workout } from '../domain/workout';
import { v4 as uuidv4 } from 'uuid';

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
            const connectionString = process.env.COSMOS_DB_CONN_STRING;
            const cosmosDbName = process.env.COSMOS_DB_NAME || 'db';
            const containerId = 'exercises';
            if(connectionString == undefined){
                throw new Error('Cosmos DB connection string is not defined.');
            }
            const client = new CosmosClient(connectionString);
            const database = client.database(cosmosDbName);
            const container = database.container(containerId);

            this.instance = new CosmosExerciseRepository(container);
        }
        return this.instance;
    };

    async createExercise(exercise: SimpleExercise): Promise<Exercise> {
        const exerciseId = uuidv4();
        const result = await this.container.items.create({
            id: exerciseId,
            template: exercise.template.name,
            workout: exercise.workout.name
        });
        if (result && result.statusCode === 201) {
            return this.getExerciseById(exerciseId);
        } else {
            throw CustomError.internal("Could not create exercise.");
        }
    }

    // async exerciseExists(name: string): Promise<boolean> {
    //     const result = await this.collection.findOne({ name });
    //     return !!result;
    // }

    async getExerciseById(id: string): Promise<Exercise> {
        const query = `SELECT * FROM c WHERE c.id = "${id}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toExercise(resources[0]);
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }

    async getExercise(template: Exercise_template, workout: Workout): Promise<Exercise> {
        const query = `SELECT * FROM c WHERE c.template = "${template.name}" and c.workout = "${workout.name}"`;
        const { resources } = await this.container.items.query(query).fetchAll();
        if (resources.length > 0) {
            return this.toExercise(resources[0]);
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }

    async getExerciseByWorkout(workout: Workout): Promise<Exercise[]> {
        const query = `SELECT * FROM c WHERE c.workout = "${workout.name}"`;
        const { resources } = await this.container.items.query(query).fetchAll();
        if (resources.length > 0) {
            let items: Exercise[] = [];
            resources.forEach((resource: any) => {
                items.push(this.toExercise(resource));
            });
            return items;
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }


    async getAllExercises(): Promise<Exercise[]> {
        const query = `SELECT * FROM c`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            let items: Exercise[] = [];
            resources.forEach((resource: any) => {
                items.push(this.toExercise(resource));
            });
            return items;
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }
}