/*
  Warnings:

  - Made the column `otp` on table `user_securities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_securities" ALTER COLUMN "otp" SET NOT NULL;
