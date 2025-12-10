import { CategoryDto, CourseCategoryDto } from '../dto/category.dto';
import { CommonListResponse } from 'src/common/helpers/api.response';

export class CategoryListResponse extends CommonListResponse<CategoryDto> {}

export class CourseCategoryResponse extends CommonListResponse<CourseCategoryDto> {}
