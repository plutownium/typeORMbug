import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";
import { Task } from "./Task";

@Entity()
export class Committee {
    @PrimaryGeneratedColumn({ name: "committee_id" })
    committeeId: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => Member, member => member.userId, { eager: true, nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "head_of" })
    head?: Member;

    @ManyToMany(() => Member, member => member.userId, { eager: true, nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "leads_for_committee" }) // I don't care what the docs say, you need @JoinTable on both sides.
    leads?: Member[];

    @ManyToMany(() => Member, member => member.userId, { eager: true, nullable: true, onDelete: "CASCADE" })
    @JoinTable({ name: "members_of_committee" }) // I don't care what the docs say, you need @JoinTable on both sides.
    members?: Member[];

    // task section
    @OneToMany(() => Task, task => task.ownedBy, { nullable: true, onDelete: "CASCADE" })
    inChargeOf?: Task[];

    @ManyToMany(() => Task, task => task.relatedCommittees, { nullable: true, onDelete: "CASCADE" })
    // @JoinTable({ name: "committee_related_tasks" }) // I don't care what the docs say, you need @JoinTable on both sides.
    tasks?: Task[];

    @CreateDateColumn({ name: "created_at" })
    createdAt?: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt?: Date;
}
