import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730058412139 implements MigrationInterface {
    name = 'Migration1730058412139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" money NOT NULL, "currency" character varying NOT NULL, "eventId" uuid NOT NULL, "isPaid" boolean NOT NULL DEFAULT false, "paidAt" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_b76e4eedb99633c207ab48cdd3e" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_b76e4eedb99633c207ab48cdd3e"`);
        await queryRunner.query(`DROP TABLE "order"`);
    }

}
