import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730305989967 implements MigrationInterface {
    name = 'Migration1730305989967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "email"`);
    }

}
