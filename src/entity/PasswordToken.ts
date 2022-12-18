import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";

@Entity()
export class PasswordToken {
    @PrimaryGeneratedColumn()
    pwTokenId: number;

    @Column()
    hexValue: string;

    @Column()
    expires: Date;

    // @ManyToOne(() => Member, (user: Member) => user.refreshTokens, { onDelete: "CASCADE" })
    // user: Member;

    @Column()
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
