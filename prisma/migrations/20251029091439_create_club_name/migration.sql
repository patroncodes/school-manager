/*
  Warnings:

  - The values [STUDENTS] on the enum `EventGroup` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `StudentAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `StudentAttendance` table. All the data in the column will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[schoolId,classId,studentId,date]` on the table `StudentAttendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `present` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `classId` on table `StudentAttendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventGroup_new" AS ENUM ('PUBLIC', 'STAFF');
ALTER TABLE "public"."Event" ALTER COLUMN "group" DROP DEFAULT;
ALTER TABLE "public"."Event" ALTER COLUMN "group" TYPE "public"."EventGroup_new" USING ("group"::text::"public"."EventGroup_new");
ALTER TYPE "public"."EventGroup" RENAME TO "EventGroup_old";
ALTER TYPE "public"."EventGroup_new" RENAME TO "EventGroup";
DROP TYPE "public"."EventGroup_old";
ALTER TABLE "public"."Event" ALTER COLUMN "group" SET DEFAULT 'PUBLIC';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentAttendance" DROP CONSTRAINT "StudentAttendance_lessonId_fkey";

-- DropIndex
DROP INDEX "public"."StudentAttendance_schoolId_studentId_date_classId_key";

-- DropIndex
DROP INDEX "public"."StudentAttendance_schoolId_studentId_date_lessonId_key";

-- DropIndex
DROP INDEX "public"."StudentAttendance_schoolId_termId_date_status_idx";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "public"."Parent" ALTER COLUMN "primaryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Staff" ADD COLUMN     "clubId" TEXT;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "clubId" TEXT;

-- AlterTable
ALTER TABLE "public"."StudentAttendance" DROP COLUMN "lessonId",
DROP COLUMN "status",
ADD COLUMN     "present" BOOLEAN NOT NULL,
ALTER COLUMN "classId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Lesson";

-- DropEnum
DROP TYPE "public"."LessonType";

-- CreateTable
CREATE TABLE "public"."Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "foundedAt" TIMESTAMP(3),
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_schoolId_name_key" ON "public"."Club"("schoolId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendance_schoolId_classId_studentId_date_key" ON "public"."StudentAttendance"("schoolId", "classId", "studentId", "date");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "public"."Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staff" ADD CONSTRAINT "Staff_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "public"."Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Club" ADD CONSTRAINT "Club_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
