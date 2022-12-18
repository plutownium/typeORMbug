import { DataSource, Repository } from "typeorm";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
//

import { Task } from "../entity/Task";
import { Member } from "../entity/Member";


const dbName = process.env.DB_NAME ? process.env.DB_NAME : "";
const dbUsername = process.env.DB_USERNAME ? process.env.DB_USERNAME : "";
const dbPassword = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "";
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 0;

if (dbName.length === 0 || dbUsername.length === 0 || dbPassword.length === 0 || dbPort === 0 || isNaN(dbPort)) {
    throw new Error("process env error");
}

const hostName = process.env.PGHOST || "localhost"; // PGHOST comes from the docker-compose.yml env variable

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "typeormtemp",
    password: "typeormtemp",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Member, Task ],
    subscribers: [],
    migrations: [],
});

export const memberRepository = AppDataSource.getRepository(Member);
export const taskRepository = AppDataSource.getRepository(Task);

export const getDataSource = (delay = 3000): Promise<DataSource> => {
    if (AppDataSource.isInitialized) {
        return Promise.resolve(AppDataSource);
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (AppDataSource.isInitialized) {
                resolve(AppDataSource);
            } else {
                reject("Failed to create connection with database");
            }
        }, delay);
    });
};
