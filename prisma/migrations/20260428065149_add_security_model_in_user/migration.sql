/*
  Warnings:

  - You are about to drop the column `isAdultConfirmed` on the `personal_details` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "personal_details" DROP COLUMN "isAdultConfirmed";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash";

-- CreateTable
CREATE TABLE "user_securities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAdultConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_securities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_securities_userId_key" ON "user_securities"("userId");

-- AddForeignKey
ALTER TABLE "user_securities" ADD CONSTRAINT "user_securities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
