import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1729721670939 implements MigrationInterface {
    name = 'Migration1729721670939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "prefix" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fb321a45a2393d639d79fcfbb15" UNIQUE ("prefix"), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "EVENTS_PREFIX_INDEX" ON "events" ("prefix") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."EVENTS_PREFIX_INDEX"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
