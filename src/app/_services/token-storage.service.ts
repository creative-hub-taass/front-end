import {Injectable} from '@angular/core';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

/*
 * Servizio utilizzato per gestire i token e le informazioni dell'utente (email, ruolo)
 * all'interno della cache del browser per quanto riguarda la sessione.
 */
export class TokenStorageService {

  constructor() {
  }

  logout(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveRefresh(token: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public getRefresh(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

}
