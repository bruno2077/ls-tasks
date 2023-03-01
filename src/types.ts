export interface User {
    id: number,
    avatar: string,
    username: string,
    whois: string,
    password: string,
    lastLogin: number, // miliseconds
    logged: boolean
}

export interface Note {
    id: number,
    userId: number,
    done: boolean,
    category: string,
    title: string,
    description: string,
    updatedAt: number // miliseconds
}