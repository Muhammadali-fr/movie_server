import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SetUsernameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9._]+$/, {
    message: "username must be lowercase and contain only a-z, 0-9, . and _",
  })
  username!: string;
}
