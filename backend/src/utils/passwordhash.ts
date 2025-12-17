import bcrypt from "bcrypt";

const genSaltRounds = 10
export const hashPassword = (password:string ): Promise<string> => {
    return bcrypt.hash(password, genSaltRounds)
}

export const verifyPassword = (hashed_password:string, password: string): Promise<boolean> => {
    return bcrypt.compare(password, hashed_password)
}