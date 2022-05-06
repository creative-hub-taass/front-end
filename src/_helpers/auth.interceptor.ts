import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TokenStorageService} from "../app/_services/token-storage.service";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {AuthService} from "../app/_services/auth.service";

const TOKEN_HEADER_KEY = "Authorization"; //per Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenStorageService, private authService: AuthService) {
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
    const token = this.tokenService.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes("login") && !authReq.url.includes("loginsocial") && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  /*
   * Intercetta richieste e risposte prima che siano utilizzate dal metodo intercept()
   * Questo metodo intercetta solo errori di status 401 che non contengano uri riferite ai diversi login
   * Utilizza il refreshTokenSubject per tenere traccia del refresh token corrente.
   * Se il refresh token è null allora nessun token è disponibile.
   *
   * Ad esempio, quando il refresh è in processo (isRefreshing = true), aspetteremo
   * finché refreshTokenSubject non abbia un valore non null (il nuovo accessToken è pronto e possiamo rimandare la richiesta)
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.tokenService.getRefresh();
      if (token)
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.tokenService.logout();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {

    return request.clone({headers: request.headers.set(TOKEN_HEADER_KEY, "Bearer " + token)});
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
