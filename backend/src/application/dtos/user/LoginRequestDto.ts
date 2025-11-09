
export class LoginRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static fromBody(body: any): LoginRequestDto {
    if (!body.email || !body.password) {
      throw new Error('Email and password are required');
    }

    return new LoginRequestDto(
      body.email.toLowerCase().trim(),
      body.password
    );
  }
}