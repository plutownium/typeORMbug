import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Role } from "../enum/Role.enum";

import { Task } from "./Task";

// can't name it "user" because it's a reserved keyword in postgres.
@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ nullable: true })
    displayName?: string;

    @ManyToMany(() => Task, (task: Task) => task.members, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "tasks_for_member" })
    tasks?: Task[];

    @Column()
    @CreateDateColumn({ name: "created_at" })
    createdAt?: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt?: Date;
}
