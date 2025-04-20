/*
  Warnings:

  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "sex" "UserSex" NOT NULL;
