import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Role } from "../enum/Role.enum";

import { Task } from "./Task";

// can't name it "user" because it's a reserved keyword in postgres.
@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    userId: number;

    // note its a string b/c google ids have values like '105768085330441011127'
    // and it's, well, it's a string. not an integer.
    @Column({ type: "text", unique: true, nullable: true })
    // todo: remove 'nullable' by end of december
    googleId?: string;

    @Column({ nullable: true })
    displayName?: string;

    @Column({ unique: true })
    email: string;

    @Column()
    role: Role;

    // todo: many to many relation btwn onboardingSteps and members



    @ManyToMany(() => Task, (task: Task) => task.members, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "tasks_for_member" })
    tasks?: Task[];

    @Column()
    @CreateDateColumn({ name: "created_at" })
    createdAt?: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt?: Date;
}
