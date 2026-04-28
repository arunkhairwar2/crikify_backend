// enums.ts

// Helper type (optional but keeps things clean)
type ValueOf<T> = T[keyof T];

// -------------------- Gender --------------------
export const GenderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;
export type GenderEnum = ValueOf<typeof GenderEnum>;

// -------------------- Age Group --------------------
export const AgeGroupEnum = {
  AGE_15_25: "AGE_15_25",
  AGE_25_30: "AGE_25_30",
  AGE_30_40: "AGE_30_40",
  AGE_40_50: "AGE_40_50",
  AGE_50_PLUS: "AGE_50_PLUS",
} as const;
export type AgeGroupEnum = ValueOf<typeof AgeGroupEnum>;

// -------------------- Organization Type --------------------
export const OrganizationType = {
  GOVT: "GOVT",
  GOVT_PSU: "GOVT_PSU",
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
  STARTUP: "STARTUP",
  NGO: "NGO",
  MNC: "MNC",
  OTHER: "OTHER",
} as const;
export type OrganizationType = ValueOf<typeof OrganizationType>;

// -------------------- Jersey Size --------------------
export const JerseySizeEnum = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  XXXL: "XXXL",
} as const;
export type JerseySizeEnum = ValueOf<typeof JerseySizeEnum>;

// -------------------- Food Preference --------------------
export const FoodPreferenceEnum = {
  VEG: "VEG",
  NON_VEG: "NON_VEG",
  JAIN: "JAIN",
} as const;
export type FoodPreferenceEnum = ValueOf<typeof FoodPreferenceEnum>;

// -------------------- Batting Style --------------------
export const BattingStyleEnum = {
  RIGHT_HAND_BAT: "RIGHT_HAND_BAT",
  LEFT_HAND_BAT: "LEFT_HAND_BAT",
  RIGHT_HAND_TOP_ORDER: "RIGHT_HAND_TOP_ORDER",
  LEFT_HAND_TOP_ORDER: "LEFT_HAND_TOP_ORDER",
  RIGHT_HAND_MIDDLE_ORDER: "RIGHT_HAND_MIDDLE_ORDER",
  LEFT_HAND_MIDDLE_ORDER: "LEFT_HAND_MIDDLE_ORDER",
} as const;
export type BattingStyleEnum = ValueOf<typeof BattingStyleEnum>;

// -------------------- Bowling Style --------------------
export const BowlingStyleEnum = {
  RIGHT_HAND_FAST_MEDIUM: "RIGHT_HAND_FAST_MEDIUM",
  LEFT_HAND_FAST_MEDIUM: "LEFT_HAND_FAST_MEDIUM",
  RIGHT_ARM_OFF_SPIN: "RIGHT_ARM_OFF_SPIN",
  LEFT_ARM_OFF_SPIN: "LEFT_ARM_OFF_SPIN",
  RIGHT_ARM_LEG_SPIN: "RIGHT_ARM_LEG_SPIN",
  LEFT_ARM_LEG_SPIN: "LEFT_ARM_LEG_SPIN",
  RIGHT_HAND_FAST: "RIGHT_HAND_FAST",
  LEFT_HAND_FAST: "LEFT_HAND_FAST",
} as const;
export type BowlingStyleEnum = ValueOf<typeof BowlingStyleEnum>;

// -------------------- Track Pant Size --------------------
export const TrackPantSizeEnum = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  XXXL: "XXXL",
} as const;
export type TrackPantSizeEnum = ValueOf<typeof TrackPantSizeEnum>;

// -------------------- Player Role --------------------
export const PlayerRoleEnum = {
  BATSMAN: "BATSMAN", // fixed typo
  BOWLER: "BOWLER",
  WICKET_KEEPER: "WICKET_KEEPER",
  ALL_ROUNDER: "ALL_ROUNDER",
} as const;
export type PlayerRoleEnum = ValueOf<typeof PlayerRoleEnum>;
