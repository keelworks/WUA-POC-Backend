export default interface UserDTO {
    id: number;
    email: string;
    name?: string;
    // Note: password is NOT included in response for security
}
