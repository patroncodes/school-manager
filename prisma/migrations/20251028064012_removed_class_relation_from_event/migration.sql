/*
  Warnings:

  - You are about to drop the column `classId` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_classId_fkey";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "classId";
