import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730062766339 implements MigrationInterface {
    name = 'Migration1730062766339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "ticketPrice"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "ticketPrice" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "amount" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "amount" money NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "ticketPrice"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "ticketPrice" money NOT NULL`);
    }

}
