import { Entity, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Role } from "../../enum/Role.enum";
import { Committee } from "./Committee";
import { Member } from "./Member";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    taskId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    status: Role;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToMany(() => Member, (member: Member) => member.tasks, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "task_leads" })
    leads?: Member[];

    @ManyToMany(() => Member, (member: Member) => member.tasks, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "task_members" })
    members?: Member[];

    @ManyToOne(() => Committee, committee => committee.inChargeOf, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "owning_committee" })
    ownedBy?: Committee;

    @ManyToMany(() => Committee, committee => committee.tasks, { nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "task_committees" })
    relatedCommittees?: Committee[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
