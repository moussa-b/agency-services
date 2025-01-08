import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.cleanNullValues(data)));
  }

  private cleanNullValues(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.cleanNullValues(item));
    } else if (typeof data === 'object' && data !== null) {
      return Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== null) {
          acc[key] = this.cleanNullValues(value);
        }
        return acc;
      }, {});
    }
    return data;
  }
}
