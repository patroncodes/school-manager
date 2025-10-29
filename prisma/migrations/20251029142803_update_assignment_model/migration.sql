/*
  Warnings:

  - You are about to drop the column `gradeId` on the `Assignment` table. All the data in the column will be lost.
  - Made the column `classId` on table `Assignment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_gradeId_fkey";

-- DropIndex
DROP INDEX "public"."Assignment_schoolId_startDate_subjectId_gradeId_key";

-- AlterTable
ALTER TABLE "public"."Assignment" DROP COLUMN "gradeId",
ALTER COLUMN "classId" SET NOT NULL;
