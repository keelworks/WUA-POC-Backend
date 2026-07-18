export default interface CreateUserDTO {
    email: string;
    password: string;  // Add this - plain text from user
    name?: string;
}