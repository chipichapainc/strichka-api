import { MigrationInterface, QueryRunner } from "typeorm";

export class EventsTableAddCodesGenerated1729785263979 implements MigrationInterface {
    name = 'EventsTableAddCodesGenerated1729785263979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "codesGenerated" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "codesGenerated"`);
    }

}
