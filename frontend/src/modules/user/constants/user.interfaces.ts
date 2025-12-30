import { SystemRole } from '@/common/constants';

export interface IUpdateUserData {
    username?: string;
    phone?: string;
    address?: string;
    password?: string;
    currentPassword?: string;
}
