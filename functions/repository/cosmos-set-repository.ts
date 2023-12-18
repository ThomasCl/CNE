import { CosmosClient } from "@azure/cosmos";
import { CustomError } from "../domain/custom-error";
import { Set, SimpleSet } from "../domain/set";
import { Exercise } from "../domain/exercise";
import { config } from "dotenv";
import { v4 as uuidv4 } from 'uuid';

export class CosmosSetRepository {

    private static instance: CosmosSetRepository;

    private toSet(document: any) {
        return new Set(
            document.id,
            document.exercise,
            document.number,
            document.weight,
            document.reps
        );
    }

    constructor(private readonly container: any) {
        if (!container) {
            throw new Error("set container is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            config();
            const connectionString = process.env.COSMOS_DB_CONN_STRING;
            const cosmosDbName = process.env.COSMOS_DB_NAME || 'db';
            const containerId = 'sets';
            if (connectionString == undefined) {
                throw new Error('Cosmos DB connection string is not defined.');
            }
            const client = new CosmosClient(connectionString);
            const database = client.database(cosmosDbName);
            const container = database.container(containerId);

            this.instance = new CosmosSetRepository(container);
        }
        return this.instance;
    };

    async createSet(set: SimpleSet): Promise<Set> {
        const result = await this.container.items.create({
            id: uuidv4(),
            exercise: set.exercise.id,
            number: set.number,
            weight: set.weight,
            reps: set.reps
        });
        if (result && result.statusCode === 201) {
            return await this.getSet(set.exercise, set.number);
        } else {
            throw CustomError.internal("Could not create set.");
        }
    }

    async updateSet(set: Set): Promise<Set> {
        const result = await this.container.items.update({
            id: set.id,
            exercise: set.exercise,
            number: set.number,
            weight: set.weight,
            reps: set.reps
        });

        if (result && result.statusCode == 201) {
            return await this.getSet(set.exercise, set.number);
        } else {
            throw CustomError.internal("Could not update set.");
        }
    }

    async setExists(exercise: Exercise, number: number): Promise<boolean> {
        const query = `SELECT * FROM c WHERE c.exercise = "${exercise.id}" and c.number = "${number}"`;
        const { resources } = await this.container.items.query(query).fetchAll();
        return resources.length > 0;
    }

    async getSet(exercise: Exercise, number: number): Promise<Set> {
        const query = `SELECT * FROM c WHERE c.exercise = "${exercise.id}" AND c.number = "${number}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toSet(resources[0]);
        } else {
            throw CustomError.notFound('Set not found.');
        }
    }

    async getSetsByExercise(exercise: string): Promise<Set[]> {
        const query = `SELECT * FROM c WHERE c.exercise = "${exercise}" order by c.number`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            let items: Set[] = [];
            resources.forEach((resource: any) => {
                items.push(this.toSet(resource));
            });
            return items;
        } else {
            throw CustomError.notFound('Set not found.');
        }
    }

    async getSetById(id: string): Promise<Set> {
        const query = `SELECT * FROM c WHERE c.id = "${id}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toSet(resources[0]);
        } else {
            throw CustomError.notFound('Set not found.');
        }
    }

    async getAllSets(): Promise<Set[]> {
        const query = `SELECT * FROM c`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            let items: Set[] = [];
            resources.forEach((resource: any) => {
                items.push(this.toSet(resource));
            });
            return items;
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }

    async deleteSet(setId: string): Promise<void> {
        const result = await this.container.item(setId).delete();
        if (result && result.statusCode === 204) {
            return;
        } else {
            throw CustomError.internal("Could not delete set.");
        }
    }
}