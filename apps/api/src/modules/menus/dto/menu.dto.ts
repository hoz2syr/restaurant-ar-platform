import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  nameAr: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsString()
  restaurantId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
