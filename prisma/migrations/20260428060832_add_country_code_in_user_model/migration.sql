/*
  Warnings:

  - You are about to drop the column `battingStyle` on the `sport_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `bowlingStyle` on the `sport_preferences` table. All the data in the column will be lost.
  - The `jerseySize` column on the `sport_preferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `trackPantSize` column on the `sport_preferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[countryCode,mobile]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryCode` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TrackPantSizeEnum" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "PlayerRoleEnum" AS ENUM ('BATSAMN', 'BOWLER', 'WICKET_KEEPER', 'ALL_ROUNDER');

-- DropIndex
DROP INDEX "users_mobile_key";

-- AlterTable
ALTER TABLE "personal_details" ADD COLUMN     "isAdultConfirmed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "dob" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sport_preferences" DROP COLUMN "battingStyle",
DROP COLUMN "bowlingStyle",
DROP COLUMN "jerseySize",
ADD COLUMN     "jerseySize" "JerseySizeEnum",
DROP COLUMN "trackPantSize",
ADD COLUMN     "trackPantSize" "TrackPantSizeEnum";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "countryCode" TEXT NOT NULL;

-- DropEnum
DROP TYPE "JerseySize";

-- CreateIndex
CREATE UNIQUE INDEX "users_countryCode_mobile_key" ON "users"("countryCode", "mobile");
