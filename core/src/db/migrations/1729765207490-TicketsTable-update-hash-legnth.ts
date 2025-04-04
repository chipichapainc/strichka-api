import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketsTableUpdateHashLength1729765207490 implements MigrationInterface {
    name = 'TicketsTableUpdateHashLength1729765207490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "hash"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "hash" character(106) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "hash"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "hash" character(32) NOT NULL`);
    }

}
