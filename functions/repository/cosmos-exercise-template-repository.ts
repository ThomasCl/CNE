import { CosmosClient } from "@azure/cosmos";
import { CustomError } from "../domain/custom-error";
import { Exercise_template } from "../domain/exercise-template";
import { config } from "dotenv";

export class CosmosExerciseTemplateRepository {

    private static instance: CosmosExerciseTemplateRepository;

    private toTemplate(document: any) {
        return new Exercise_template(document.name, document.group);
    }

    constructor(private readonly container: any) {
        if (!container) {
            throw new Error("template container is required.");
        }
    }   

    static async getInstance() {
        if (!this.instance) {
            config();
            const connectionString = process.env.COSMOS_DB_CONN_STRING;
            const cosmosDbName = process.env.COSMOS_DB_NAME || 'db';
            const containerId = 'templates';
            if(connectionString == undefined){
                throw new Error('Cosmos DB connection string is not defined.');
            }
            const client = new CosmosClient(connectionString);
            const database = client.database(cosmosDbName);
            const container = database.container(containerId);

            this.instance = new CosmosExerciseTemplateRepository(container);
        }
        return this.instance;
    };

    async createTemplate(template: Exercise_template): Promise<Exercise_template> {
        const result = await this.container.items.create({
            name: template.name,
            group: template.group
        });

        if (result && result.statusCode === 201) {
            return this.getTemplate(template.name);
        } else {
            throw CustomError.internal('Could not create template.');
        }
    }

    async templateExists(name: string): Promise<boolean> {
        const query = `SELECT * FROM c WHERE c.name = "${name}"`;
        const { resources } = await this.container.items.query(query).fetchAll();
        return resources.length > 0;
    }

    async getTemplate(name: string): Promise<Exercise_template> {
        const query = `SELECT * FROM c WHERE c.name = "${name}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toTemplate(resources[0]);
        } else {
            throw CustomError.notFound('Template not found.');
        }
    }

    async getAllTemplates(): Promise<Exercise_template[]> {
        const query = `SELECT * FROM c`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            let items: Exercise_template[] = [];
            resources.forEach((resource: any) => {
                items.push(this.toTemplate(resource));
            });
            return items;
        } else {
            throw CustomError.notFound('Exercise not found.');
        }
    }

    async getTemplatesLike(name: string): Promise<Exercise_template[]> {
        const query = `SELECT * FROM c WHERE CONTAINS(c.name, "${name}")`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            let items: Exercise_template[] = [];
            resources.forEach((resource: any) => {
                items.push(this.toTemplate(resource));
            });
            return items;
        } else {
            throw CustomError.notFound('Template not found.');
        }
    }

    async getTemplateById(id: number): Promise<Exercise_template> {
        const query = `SELECT * FROM c WHERE c.id = "${id}"`;
        const { resources } = await this.container.items.query(query).fetchAll();

        if (resources.length > 0) {
            return this.toTemplate(resources[0]);
        } else {
            throw CustomError.notFound('Template not found.');
        }
    }
}