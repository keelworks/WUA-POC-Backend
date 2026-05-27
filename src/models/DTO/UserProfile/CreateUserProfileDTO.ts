export default interface CreateUserProfileDTO {
    userId: number;
    roleId: number;
    pushNotificationToken?: string;
}