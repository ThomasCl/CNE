import { CosmosClient } from "@azure/cosmos";
import { CustomError } from "../domain/custom-error";
import { Set } from "../domain/set";
import { Exercise } from "../domain/exercise";
import { config } from "dotenv";

export class CosmosSetRepository {

    private static instance: CosmosSetRepository;

    private toSet(document: any) {
        return new Set(
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
            if(connectionString == undefined){
                throw new Error('Cosmos DB connection string is not defined.');
            }
            const client = new CosmosClient(connectionString);
            const database = client.database(cosmosDbName);
            const container = database.container(containerId);

            this.instance = new CosmosSetRepository(container);
        }
        return this.instance;
    };

    async createSet(set: Set): Promise<Set> {
        const result = await this.container.items.create({
            exercise: set.exercise,
            number: set.number,
            weight: set.weight,
            reps: set.reps
        });
        if (result && result.statusCode === 201) {
            return this.getSet(set.exercise, set.number);
        } else {
            throw CustomError.internal("Could not create set.");
        }
    }

    async setExists(exercise: Exercise, number: number): Promise<boolean> {
        const query = `SELECT * FROM c WHERE c.exercise = "${exercise}" AND c.number = "${number}"`;
        const { resources } = await this.container.items.query(query).fetchAll();
        return resources.length > 0;
    }

    async getSet(exercise: Exercise, number: number): Promise<Set> {
        const query = `SELECT * FROM c WHERE c.exercise = "${exercise}" AND c.number = "${number}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toSet(resources[0]);
        } else {
            throw CustomError.notFound('Set not found.');
        }
    }
}