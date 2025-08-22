export interface User {
    id: string; // 'me' if it's the current user
    name: string;
    status?: string;
}