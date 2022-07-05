import {Component, OnInit} from "@angular/core";
import {AuthService} from "../_services/auth.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {FacebookLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})

export class LoginComponent implements OnInit {
  form: { password: string; email: string } = {
    email: "",
    password: ""
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  socialUser !: SocialUser;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe({
      next: this.onLogin,
      error: (error) => {
        this.isLoginFailed = true;
        this.errorMessage = error.errorMessage;
      }
    });
  }

  ngAfterViewInit() {
    this.loadScript("GOOGLE",
      "https://accounts.google.com/gsi/client",
      () => {
        // @ts-ignore
        window.onGoogleLibraryLoad = () => {
          // @ts-ignore
          google.accounts.id.initialize({
            client_id: "1035582852846-7d31c3v088hkm1uvpv0us1uvkot349s6.apps.googleusercontent.com",
            callback: (response: any) => {
              const socialUser = this.createSocialUser(response.credential);
              this.onLogin(socialUser);
            }
          });
          // @ts-ignore
          google.accounts.id.renderButton(document.getElementById("googleButton"), {
            shape: "pill",
            size: "large",
            text: "signin_with",
            theme: "outline",
            type: "standard"
          });
          // @ts-ignore
          google.accounts.id.prompt(); // also display the One Tap dialog
        };
      });
  }

  createSocialUser(idToken: string) {
    const user = new SocialUser();
    user.idToken = idToken;
    const payload: Record<any, any> = jwt_decode(idToken);
    user.id = payload["sub"];
    user.name = payload["name"];
    user.email = payload["email"];
    user.photoUrl = payload["picture"];
    user.firstName = payload["given_name"];
    user.lastName = payload["family_name"];
    return user;
  }

  onLogin(userSocial?: SocialUser) {
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
  }

  onSubmit(): void {
    const {email, password} = this.form;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.tokenStorage.saveUser(data.body);
        this.tokenStorage.saveToken(data.headers.get("X-ACCESS-TOKEN"));
        this.tokenStorage.saveRefresh(data.headers.get("X-REFRESH-TOKEN"));
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

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  protected loadScript(id: string, src: string, onload: any, parentElement: HTMLElement | null = null): void {
    // get document if platform is only browser
    if (typeof document !== "undefined" && !document.getElementById(id)) {
      let signInJS = document.createElement("script");
      signInJS.async = true;
      signInJS.src = src;
      signInJS.onload = onload;
      if (!parentElement) {
        parentElement = document.head;
      }
      parentElement.appendChild(signInJS);
    }
  }

}
