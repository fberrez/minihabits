import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.decorator';

export function PublicRoute() {
  return applyDecorators(
    Public(),
    ApiTags('public'),
    ApiSecurity('no-auth', ['x-no-auth']),
  );
}
