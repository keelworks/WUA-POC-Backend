// Centralized definition of the role titles supported by the system.
// Previously these were duplicated as a magic array (VALID_ROLES) inside
// RoleController and described only in a schema comment. Keeping them here
// gives a single source of truth for any layer that needs to validate or
// reference a role title.
export enum RoleTitle {
    Admin = "Admin",
    Normal = "Normal",
}

// Convenience list derived from the enum, for membership checks and for
// building user-facing validation messages.
export const VALID_ROLE_TITLES: string[] = Object.values(RoleTitle);

// Type guard: narrows an arbitrary string to a valid RoleTitle.
export function isValidRoleTitle(value: string): value is RoleTitle {
    return VALID_ROLE_TITLES.includes(value);
}