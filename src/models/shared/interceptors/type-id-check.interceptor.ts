import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TypeIdCheckInterceptor implements NestInterceptor {
  constructor(private readonly allowedTypeId: number) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userType = request.user.type_id;

    if (userType !== this.allowedTypeId) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }

    return next.handle();
  }
}
