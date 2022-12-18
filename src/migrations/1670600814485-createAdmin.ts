import { MigrationInterface, QueryRunner } from 'typeorm';

import { USER_ROLE } from '../users/users.constants';

export class createAdmin1670600814485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedAdminPassword = '$2b$12$wQXvoBVN4fT3QocIlYKvzOIfUBQaXAi16OqLAfxfnpXlp9PrmyUqq';

    await queryRunner.query(
      `INSERT INTO "user" (username, password, email, role) VALUES ('admin', $1, 'admin@admin.com', $2)`,
      [hashedAdminPassword, USER_ROLE.ADMIN]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user" WHERE role=$1`, [USER_ROLE.ADMIN]);
  }
}
