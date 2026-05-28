export default interface UserProfileDTO {
    id: number;
    userId: number;
    roleId: number;
    pushNotificationToken?: string;
}