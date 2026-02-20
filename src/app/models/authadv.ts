export interface AuthAdvUserModel {
    id: number;
    username: string;
    password: string;
    email: string;
    displayName: string;
    avatar: string;
    cover: string;
    permissions?: AuthAdvUserModelPermissionsInfo;
    isUserConfirmed?: boolean;
    isUserBanned?: boolean;
    isUserAuthLocked?: boolean;
    timeCreation?: Date | string;
    timeUserAuthLocked?: Date | string;
    role?: AuthAdvUserModelRoles | string;
    privacy?: AuthAdvUserModelPrivacy | string;
    usersInfoId?: number;
}

export interface AuthAdvUserModelPermissionsInfo {
    permissionsid: number;
    type: AuthAdvUserModelPermissionsTypes | string;
    code: string;
    description: string;
}

export enum AuthAdvUserModelPermissionsTypes {
    READ_DATA = 0,
    CREATE_DATA = 1,
    UPDATE_DATA = 2,
    DELETE_DATA = 3,
    LOCK_DATA = 4,
    BAN_BAD_USERS_ONLY = 5
}

export enum AuthAdvUserModelRoles { 
    user = 0,
    admin = 1,
    moderator = 2,
    guest = 3,
    vip = 4,
    banned = 5
}

export enum AuthAdvUserModelPrivacy {
    private = 0,
    public = 1
}