import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(NzNotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (req.method.toUpperCase() === 'GET') return throwError(() => err);

      toast.error(err.error?.title || 'Error', err.error?.detail || 'Internal server error!', {
        nzClass: 'error',
      });

      return throwError(() => err);
    })
  );
};