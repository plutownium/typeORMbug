import { DataSource, Repository } from "typeorm";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
//

import { Task } from "./entity/Task";
import { Member } from "./entity/Member";
import { Committee } from "./entity/Committee";




export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "typeormtest",
    synchronize: true,
    logging: false,
    entities: [Member, Task, Committee ],
    subscribers: [],
    migrations: [],
});

// export const committeeRepository = AppDataSource.getRepository(Committee);
// export const memberRepository = AppDataSource.getRepository(Member);
// export const taskRepository = AppDataSource.getRepository(Task);

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
