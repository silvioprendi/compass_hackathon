import { MigrationInterface, QueryRunner } from 'typeorm';

export class Knowledge1763560800822 implements MigrationInterface {
  name = 'Knowledge1763560800822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "knowledge_articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "raw_content" text NOT NULL, "problem" text NOT NULL, "solution" text NOT NULL, "tags" text array NOT NULL DEFAULT '{}', "solved" boolean NOT NULL DEFAULT false, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4dff86fc9e08f53fe1d4cfe5fb1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "knowledge_articles"`);
  }
}
