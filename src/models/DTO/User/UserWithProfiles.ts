import { Prisma } from "@prisma/client";

export const userWithProfilesInclude = {
  profiles: {
    include: {
      role: true,
    },
  },
} satisfies Prisma.UserInclude; 

// Prisma.UserGetPayload precisa de P maiúsculo
export type UserWithProfiles = Prisma.UserGetPayload<{
  include: typeof userWithProfilesInclude;
}>;
