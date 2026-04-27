-- CreateEnum
CREATE TYPE "JerseySize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AgeGroupEnum" AS ENUM ('AGE_15_25', 'AGE_25_30', 'AGE_30_40', 'AGE_40_50', 'AGE_50_PLUS');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('GOVT', 'GOVT_PSU', 'PRIVATE', 'PUBLIC', 'STARTUP', 'NGO', 'MNC', 'OTHER');

-- CreateEnum
CREATE TYPE "JerseySizeEnum" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "FoodPreferenceEnum" AS ENUM ('VEG', 'NON_VEG', 'JAIN');

-- CreateEnum
CREATE TYPE "BattingStyleEnum" AS ENUM ('RIGHT_HAND_BAT', 'LEFT_HAND_BAT', 'RIGHT_HAND_TOP_ORDER', 'LEFT_HAND_TOP_ORDER', 'RIGHT_HAND_MIDDLE_ORDER', 'LEFT_HAND_MIDDLE_ORDER');

-- CreateEnum
CREATE TYPE "BowlingStyleEnum" AS ENUM ('RIGHT_HAND_FAST_MEDIUM', 'LEFT_HAND_FAST_MEDIUM', 'RIGHT_ARM_OFF_SPIN', 'LEFT_ARM_OFF_SPIN', 'RIGHT_ARM_LEG_SPIN', 'LEFT_ARM_LEG_SPIN', 'RIGHT_HAND_FAST', 'LEFT_HAND_FAST');

-- CreateTable
CREATE TABLE "professional_details" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentDesignation" TEXT,
    "organizationName" TEXT,
    "orgType" "OrganizationType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pinCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_details" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gender" "GenderEnum",
    "dob" TIMESTAMP(3),
    "nickname" TEXT,
    "ageGroup" "AgeGroupEnum",
    "foodPreference" "FoodPreferenceEnum",
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sport_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jerseySize" "JerseySize",
    "jerseyName" TEXT,
    "jerseyNumber" INTEGER,
    "trackPantSize" "JerseySize",
    "battingStyle" "BattingStyleEnum",
    "bowlingStyle" "BowlingStyleEnum",
    "shoeSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sport_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professional_details_userId_key" ON "professional_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_userId_key" ON "addresses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_userId_key" ON "personal_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sport_preferences_userId_key" ON "sport_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "professional_details" ADD CONSTRAINT "professional_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_details" ADD CONSTRAINT "personal_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_preferences" ADD CONSTRAINT "sport_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
