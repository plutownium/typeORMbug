import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    rTokenId: number;

    @Column()
    hexValue: string;

    @Column()
    isActive: boolean;

    @Column()
    createdByIp: string;

    @Column({ nullable: true })
    revoked: Date;

    @Column({ nullable: true })
    revokedByIp: string;

    @Column({ nullable: true })
    replacedByToken: string;

    // @ManyToOne(() => Member, (user: Member) => user.refreshTokens)
    // user: Member;

    @Column()
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
