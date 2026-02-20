import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//        const token = localStorage.getItem('token');
//        if (token) {
//            const cloned = req.clone({
//                headers: req.headers.set('Authorization', `Bearer ${token}`)
//            });
//            return next.handle(cloned);
//        }
//        return next.handle(req);
//    }
// }

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('accessToken');

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}

