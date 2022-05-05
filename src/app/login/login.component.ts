import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser
} from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form: any = {
    email: null,
    password: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  nickname: any;
  socialUser !: SocialUser;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {

    this.socialAuthService.authState.subscribe(
      (user) => {
        if(user != null){
          this.socialUser = user;
          this.authService.loginSocial(this.socialUser.firstName+' '+this.socialUser.lastName, this.socialUser.email,this.socialUser.authToken).subscribe(
            (user) => {
              this.tokenStorage.saveUser(user.body);
              this.tokenStorage.saveToken(user.headers.get('X-ACCESS-TOKEN'));
              this.tokenStorage.saveRefresh(user.headers.get('X-REFRESH-TOKEN'));
              this.isLoginFailed = false;
              this.isLoggedIn = true;
              window.location.reload();
            },
            (error) => {
              this.isLoginFailed = true;
              this.errorMessage = error.error;
            }
          )
        }
      },
      (error) => {
        this.isLoginFailed = true;
        this.errorMessage = error.errorMessage;
      }
    )
  }

  onSubmit(): void {
    const {email, password} = this.form;
    this.authService.login(email, password).subscribe(
      (data)=> {
        this.tokenStorage.saveUser(data.body);
        this.tokenStorage.saveToken(data.headers.get('X-ACCESS-TOKEN'));
        this.tokenStorage.saveRefresh(data.headers.get('X-REFRESH-TOKEN'));
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        window.location.reload();
      },
      ((error: HttpErrorResponse) => {
        this.isLoginFailed = true;
        this.errorMessage = error.error;
      }))
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);

  }

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
