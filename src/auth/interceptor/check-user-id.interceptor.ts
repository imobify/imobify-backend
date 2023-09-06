import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CheckUserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userIdInToken = request.user.id;
    const userIdInURL = request.params.id;

    if (userIdInToken !== userIdInURL) {
      throw new UnauthorizedException('No permission.');
    }

    return next.handle();
  }
}
