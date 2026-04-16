export const ROLES = {
    ADMIN: 1,
    EMPLOYER: 2,
    CANDIDATE: 3,
}

export const ROLE_NAMES = {
    [ROLES.ADMIN]: "admin",
    [ROLES.EMPLOYER]: "employer",
    [ROLES.CANDIDATE]: "candidate",
}

export const ROLE_REDIRECTS = {
    [ROLES.ADMIN]: "/admin",
    [ROLES.EMPLOYER]: "/employer",
    [ROLES.CANDIDATE]: "/candidate",
}

export const ROLE_PATHS = {
    [ROLES.ADMIN]: "/admin",
    [ROLES.EMPLOYER]: "/employer",
    [ROLES.CANDIDATE]: "/candidate",
}
