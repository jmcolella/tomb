export class UserApiEntity {
  public readonly id: string;
  public readonly email?: string | null;

  constructor(id: string, email?: string | null) {
    this.id = id;
    this.email = email;
  }
}
