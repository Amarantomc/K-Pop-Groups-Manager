import  { UserResponseDto } from "./UserResponseDto";

export class LoginResponseDto {
  constructor(
    public readonly user: UserResponseDto,
    public readonly token: string,
    public readonly expiresIn: number = 3600
  ) {}

  static fromEntity(authResult: any): LoginResponseDto {
    return new LoginResponseDto(
      UserResponseDto.fromEntity(authResult.user),
      authResult.token,
      authResult.expiresIn
    );
  }
}