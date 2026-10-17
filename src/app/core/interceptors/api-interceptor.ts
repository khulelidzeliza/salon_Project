import { HttpInterceptorFn } from '@angular/common/http';
import { env } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('graphql')) return next(req);
  const apiReq = req.clone({
    withCredentials: true,
    url: `${env.REST_API_URL}${req.url}`,
  });
  
  return next(apiReq);
};
