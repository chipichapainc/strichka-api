import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTicketsTable1729634620745 implements MigrationInterface {
    name = 'CreateTicketsTable1729634620745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tickets" ("id" character varying NOT NULL, "hash" character(32) NOT NULL, "useCount" smallint NOT NULL DEFAULT '0', "useMax" smallint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tickets"`);
    }

}
