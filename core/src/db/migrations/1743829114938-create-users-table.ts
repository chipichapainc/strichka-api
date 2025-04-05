import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743829114938 implements MigrationInterface {
    name = 'Migration1743829114938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "email" character varying NOT NULL, 
                "password" character varying NOT NULL, 
                "firstName" character varying, 
                "lastName" character varying, 
                "handle" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                CONSTRAINT "UQ_6a7e5f591436179c411f5308a9e" UNIQUE ("handle"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
