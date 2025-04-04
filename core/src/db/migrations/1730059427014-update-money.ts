import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730059427014 implements MigrationInterface {
    name = 'Migration1730059427014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "ticketPrice" money NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."events_ticketpricecurr_enum" AS ENUM('UAH', 'USD', 'EUR')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "ticketPriceCurr" "public"."events_ticketpricecurr_enum" NOT NULL DEFAULT 'UAH'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "currency"`);
        await queryRunner.query(`CREATE TYPE "public"."order_currency_enum" AS ENUM('UAH', 'USD', 'EUR')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "currency" "public"."order_currency_enum" NOT NULL DEFAULT 'UAH'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "public"."order_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "currency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "ticketPriceCurr"`);
        await queryRunner.query(`DROP TYPE "public"."events_ticketpricecurr_enum"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "ticketPrice"`);
    }

}
