import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  url!: string;
}
