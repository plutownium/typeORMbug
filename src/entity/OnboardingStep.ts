import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OnboardingStep {
    @PrimaryGeneratedColumn()
    stepId: number;

    @Column()
    stepName: string;

    @Column()
    description: string;

    // todo: many to many relation btwn onboardingSteps and members

    @Column()
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
