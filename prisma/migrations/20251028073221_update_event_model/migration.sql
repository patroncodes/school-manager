/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `EventStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."EventGroup" AS ENUM ('PUBLIC', 'STAFF', 'STUDENTS');

-- DropForeignKey
ALTER TABLE "public"."EventStudent" DROP CONSTRAINT "EventStudent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventStudent" DROP CONSTRAINT "EventStudent_studentId_fkey";

-- DropIndex
DROP INDEX "public"."Event_schoolId_startTime_isPublic_idx";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "isPublic",
ADD COLUMN     "group" "public"."EventGroup" NOT NULL DEFAULT 'PUBLIC';

-- DropTable
DROP TABLE "public"."EventStudent";

-- CreateIndex
CREATE INDEX "Event_schoolId_startTime_group_idx" ON "public"."Event"("schoolId", "startTime", "group");
