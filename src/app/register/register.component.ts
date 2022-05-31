import {Component, OnInit} from "@angular/core";
import {AuthService} from "../_services/auth.service";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser
} from "@abacritt/angularx-social-login";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {

  form: any = {
    nickname: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = "";
  isLoggedIn = false;
  isLoginFailed = false;
  socialUser !: SocialUser;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe({
      next: (userSocial) => {
        if (userSocial != null) {
          this.socialUser = userSocial;
          this.authService.loginSocial(this.socialUser.firstName + " " + this.socialUser.lastName, this.socialUser.email, this.socialUser.authToken).subscribe({
            next: (userCreative) => {
              this.tokenStorage.saveUser(userCreative.body);
              this.tokenStorage.saveToken(userCreative.headers.get("X-ACCESS-TOKEN"));
              this.tokenStorage.saveRefresh(userCreative.headers.get("X-REFRESH-TOKEN"));
              this.isLoginFailed = false;
              this.isLoggedIn = true;
              window.location.replace("/");
            },
            error: (error) => {
              this.isLoginFailed = true;
              this.errorMessage = error.error;
            }
          });
        }
      },
      error: (error) => {
        this.isLoginFailed = true;
        this.errorMessage = error.errorMessage;
      }
    });
  }

  onSubmit(): void {
    const {nickname, email, password} = this.form;
    this.authService.register(nickname, email, password).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.isRegistrationFailed = false;
      },
      error: (error) => {
        this.errorMessage = error.error;
      }
    });
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
