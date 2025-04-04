import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketsTableHashUpdate1729785886067 implements MigrationInterface {
    name = 'TicketsTableHashUpdate1729785886067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "hash"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "hash" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "hash"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "hash" character(106) NOT NULL`);
    }

}
