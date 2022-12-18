import { Entity, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Role } from "../enum/Role.enum";
import { Member } from "./Member";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    taskId: number;

    @Column("text")
    title: string;


    @ManyToMany(() => Member, (member: Member) => member.tasks, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "task_leads" })
    leads?: Member[];

    @ManyToMany(() => Member, (member: Member) => member.tasks, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "task_members" })
    members?: Member[];



    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
