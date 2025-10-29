/*
  Warnings:

  - You are about to drop the column `attachedFile` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Exam` table. All the data in the column will be lost.
  - You are about to alter the column `maxScore` on the `Exam` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `date` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Exam" DROP COLUMN "attachedFile",
DROP COLUMN "questions",
DROP COLUMN "title",
ADD COLUMN     "attachedFiles" TEXT[],
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" DROP NOT NULL,
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
ALTER COLUMN "maxScore" SET DATA TYPE INTEGER;
