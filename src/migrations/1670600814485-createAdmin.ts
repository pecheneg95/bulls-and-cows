import { MigrationInterface, QueryRunner } from 'typeorm';

import { USER_ROLE } from '../users/users.constants';

export class createAdmin1670600814485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedAdminPassword =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjcxMDEzNjQ5fQ.8z-qZ0QfUanMAZGrwwOMOxbzh3icK1taK0i0B0LT_PA';

    await queryRunner.query(
      `INSERT INTO "user" (username, password, email, role) VALUES ('admin', $1, 'admin@admin.com', $2)`,
      [hashedAdminPassword, USER_ROLE.ADMIN]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user" WHERE role=$1`, [USER_ROLE.ADMIN]);
  }
}
