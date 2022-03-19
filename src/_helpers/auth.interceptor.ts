import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { TokenStorageService } from "../app/_services/token-storage.service";
import { Observable } from "rxjs";

const TOKEN_HEADER_KEY = 'Authorization'; //per Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorageService) {
  }

  /*
   * intercept() prende l'oggetto HTTPRequest, lo cambia e
   * invia a HttpHandler l'oggetto dei metodi handle().
   * Esso trasforma l'oggetto HTTPRequest all'interno di un oggetto
   * Observable<HttpEvents>
   *
   * L'oggetto HttpHandler next rappresenta il prossimo interceptor nella
   * catena degli interceptor. L'oggetto next alla fine della catena è
   * l'HttpClient Angular
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
