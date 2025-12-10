import { User } from '../entity/user.entity';

export interface UserChangeDto {
  username: string;
  address: string;
  phone: string;
  password: string;
  currentPassword: string;
}

export type InstructorDto = Pick<
  User,
  'id' | 'username' | 'email' | 'phone' | 'address'
>;
