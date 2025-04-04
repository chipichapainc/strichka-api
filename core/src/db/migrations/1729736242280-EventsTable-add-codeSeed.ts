import { MigrationInterface, QueryRunner } from "typeorm";

export class EventsTableAddCodeSeed1729736242280 implements MigrationInterface {
    name = 'EventsTableAddCodeSeed1729736242280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "codeSeed" BIGSERIAL NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "codeSeed"`);
    }

}
