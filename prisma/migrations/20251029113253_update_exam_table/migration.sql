/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,date,type,subjectId,gradeId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Exam_schoolId_startTime_subjectId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Exam_schoolId_date_type_subjectId_gradeId_key" ON "public"."Exam"("schoolId", "date", "type", "subjectId", "gradeId");
