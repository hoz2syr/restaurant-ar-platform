import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateMenuItemDto {
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

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  preparationTime: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  hasArModel?: boolean;

  @IsOptional()
  @IsString()
  arModelUrl?: string;

  @IsOptional()
  @IsString()
  arModelUrlIos?: string;

  @IsOptional()
  @IsString()
  arModelUrlAndroid?: string;

  @IsOptional()
  @IsString()
  arThumbnail?: string;
}

export class UpdateMenuItemDto {
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
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  preparationTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  hasArModel?: boolean;

  @IsOptional()
  @IsString()
  arModelUrl?: string;

  @IsOptional()
  @IsString()
  arModelUrlIos?: string;

  @IsOptional()
  @IsString()
  arModelUrlAndroid?: string;

  @IsOptional()
  @IsString()
  arThumbnail?: string;
}
