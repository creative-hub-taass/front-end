import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from "./profile/profile.component";

import {HomeComponent} from "./home/home.component";
import {ArtworkComponent} from "./artwork/artwork.component";
import {EventComponent} from "./event/event.component";
import {PostComponent} from "./post/post.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "registration", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "users", component: ProfileComponent},
  {path: "artwork/:id", component: ArtworkComponent},
  {path: "event/:id", component: EventComponent},
  {path: "post/:id", component: PostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
