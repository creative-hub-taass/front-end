import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {authInterceptorProviders} from "src/_helpers/auth.interceptor";
import {FormsModule} from "@angular/forms";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from "@abacritt/angularx-social-login";
import {CoolSocialLoginButtonsModule} from "@angular-cool/social-login-buttons";
import {ProfileComponent} from "./profile/profile.component";

import {HomeComponent} from "./home/home.component";
import {ArtworkComponent} from "./artwork/artwork.component";
import { EventComponent } from './event/event.component';
import { PostComponent } from './post/post.component';
import { ModifyArtworkComponent } from './modify-artwork/modify-artwork.component';
import { ModifyEventComponent } from './modify-event/modify-event.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    ArtworkComponent,
    EventComponent,
    PostComponent,
    ModifyArtworkComponent,
    ModifyEventComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    CoolSocialLoginButtonsModule
  ],
  providers: [authInterceptorProviders,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("560270769175115")
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("420683265133-6d5kfiedo8shhorjhi3du2ia8ue210un.apps.googleusercontent.com")
          }
        ]
      } as SocialAuthServiceConfig
    },
    LoginComponent],
  bootstrap: [AppComponent]
})

export class AppModule {}
