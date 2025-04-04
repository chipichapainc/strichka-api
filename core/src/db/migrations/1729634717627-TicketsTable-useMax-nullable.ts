import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketsTableUseMaxNullable1729634717627 implements MigrationInterface {
    name = 'TicketsTableUseMaxNullable1729634717627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ALTER COLUMN "useMax" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ALTER COLUMN "useMax" SET NOT NULL`);
    }

}
