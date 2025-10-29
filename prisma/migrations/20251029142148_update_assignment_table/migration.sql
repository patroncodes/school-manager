/*
  Warnings:

  - You are about to drop the column `questions` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Assignment` table. All the data in the column will be lost.
  - You are about to alter the column `maxScore` on the `Assignment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[schoolId,startDate,subjectId,gradeId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,startDate,subjectId,classId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Assignment_schoolId_dueDate_subjectId_classId_idx";

-- AlterTable
ALTER TABLE "public"."Assignment" DROP COLUMN "questions",
DROP COLUMN "title",
ADD COLUMN     "gradeId" TEXT,
ALTER COLUMN "maxScore" SET DATA TYPE INTEGER,
ALTER COLUMN "classId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_schoolId_startDate_subjectId_gradeId_key" ON "public"."Assignment"("schoolId", "startDate", "subjectId", "gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_schoolId_startDate_subjectId_classId_key" ON "public"."Assignment"("schoolId", "startDate", "subjectId", "classId");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
