import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, switchMap, throwError } from "rxjs";

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          return this.auth.refreshToken().pipe(
            switchMap(tokens => {
              this.auth['storeTokens'](tokens);
              return next.handle(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`
                }
              }));
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
