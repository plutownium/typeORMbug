import express, { Application } from "express";
import "reflect-metadata"; // needed for typeorm
import { getConnection } from "typeorm";
import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
//

import { AppDataSource } from "./db/data-source";

//

class App {
    public app: Application;

    public port: number;

    constructor(appInit: { port: number; middlewares: any; controllers: any }) {
        this.app = express();
        this.port = appInit.port;

        this.middlewares(appInit.middlewares);
        console.log("initiating routes");
        this.routes(appInit.controllers);
    }

    public listen() {
        this.app.listen(this.port, async () => {
            console.log(`App has started on port ${this.port}`);
            try {
                await this.authenticateDB();
                console.log("Done syncing...");
            } catch (err) {
                console.log("Database connection failed", err);
            }
        });
    }

    public getServer() {
        return this.app;
    }

    public async authenticateDB() {
        await AppDataSource.initialize();
        console.log("Connection initialized with database...");
    }

    private middlewares(middlewares: any) {
        middlewares.forEach((middleware: any) => {
            // console.log("adding middleware...");
            this.app.use(middleware);
        });
    }

    private routes(controllers: any) {
        console.log("Controllers added");
        controllers.forEach((controller: any) => {
            // console.log(controller.path, "... is running");
            this.app.use(controller.path, controller.router);
        });
    }


    public async purgeDb(tableName: "All" | "PasswordToken" | "Committee" | "Task" | "Member" | "RefreshToken" | "OnboardingStep") {
        // to use when you want to -- you guessed it -- purge the db. careful! hard to undo.
        // note you must run 'await app.authenticateDB();' first!
        const entities = AppDataSource.entityMetadatas;
        console.log(entities.map(e => [e.name, e.tableName]));
        for (const entity of entities) {
            if (entity.name == tableName || tableName === "All") {
                console.log(entity.name, entity.tableName, "cleared");
                const repository = await AppDataSource.getRepository(entity.name);
                await repository.query(`DELETE FROM ${entity.tableName};`);
            }
        }
    }

    public async initializeCaches() {}
}

// dao
// const committeeDAO = new CommitteeDAO(committeeRepository);
// const onboardingStepsDAO = new OnboardingStepDAO(onboardingStepsRepository);
// const memberDAO = new MemberDAO(memberRepository);
// const taskDAO = new TaskDAO(taskRepository, memberDAO, memberRepository);
// const refreshTokenDAO = new RefreshTokenDAO(refreshTokenRepository);
// const passwordTokenDAO = new PasswordTokenDAO(passwordTokenRepository);


// // controller
// const taskController = new TaskController(taskService);
// const committeeeController = new CommitteeController(committeeService);
// const authController = new AuthController(authService);
// const healthController = new HealthController();

const port = parseInt(process.env.PORT!, 10);
export const app = new App({
    port: port || 5200,

    controllers: [],
    middlewares: [
        (req: any, res: any, next: any) => {
            // used for debugging.
            next();
        },
    ],
});

export const server = app.getServer();

export default App;
