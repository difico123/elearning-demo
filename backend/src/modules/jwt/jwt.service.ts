import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: JwtService) {}

  sign(id: string, name) {
    let tokenString = this.jwtService.sign(
      {
        id: id,
        name: name,
      }
    );

    return tokenString;
  }
}
