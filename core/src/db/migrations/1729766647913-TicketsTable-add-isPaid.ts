import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketsTableAddIsPaid1729766647913 implements MigrationInterface {
    name = 'TicketsTableAddIsPaid1729766647913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ADD "isPaid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "isPaid"`);
    }

}
