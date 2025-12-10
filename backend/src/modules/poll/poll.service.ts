import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISocketUser } from 'src/common/interfaces';
import { JWTService } from '../jwt/jwt.service';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  private readonly users: ISocketUser[] = [];
  constructor(private readonly jwtService: JWTService) {}

  joinPoll(user: ISocketUser) {
    let userIndex = this.userIndex(user.userID);
    if (userIndex === -1) {
      this.users.push({
        ...user,
        count: user.count || 0,
      });
    } else {
      this.users[userIndex] = {
        ...user,
        count: this.users[userIndex].count + 1,
      };
    }
    return this.users;
  }

  userIndex(userID: string) {
    return this.users.findIndex((item) => {
      return userID === item.userID;
    });
  }

  setAvatar(userID: string, avatar: string) {
    let userIndex = this.userIndex(userID);
    if (userIndex !== -1) {
      this.users[userIndex].image = avatar;
    }
  }

  getUser(userId: string): Partial<ISocketUser> {
    let userIndex = this.userIndex(userId);
    return userIndex !== -1 ? this.users[userIndex] : {};
  }

  getUsers() {
    return this.users;
  }
  userLeave(userID: string) {
    let userIndex = this.userIndex(userID);
    if (userIndex !== -1) {
      if (!this.users[userIndex].count) {
        this.users.splice(userIndex, 1);
      } else {
        this.users[userIndex].count = this.users[userIndex].count - 1;
      }
    }
    return this.users;
  }
}
