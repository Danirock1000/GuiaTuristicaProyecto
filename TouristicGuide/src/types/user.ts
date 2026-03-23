export type User = {
    id: string,
    name: string,
    email: string,
    avatarUrl: string,
    role: string,
    isActive: boolean,
    createdAt: string,
    token?: string,
} | null;