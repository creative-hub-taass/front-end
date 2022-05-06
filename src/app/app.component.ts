import {Component, OnDestroy, OnInit} from "@angular/core";
import {TokenStorageService} from "./_services/token-storage.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Subscription} from "rxjs";
import {EventBusService} from "../_shared/event-bus.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  nickname?: string;
  title: string | undefined;
  eventBusSub?: Subscription;

  public jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private tokenStorageService: TokenStorageService, private eventBusService: EventBusService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.nickname = user.nickname;
    }
    /*
   * Possiamo mandare eventi al bus e se un listener è registrato con l'eventName,
   * eseguirà una callback alla funzione action
   */
    this.eventBusSub = this.eventBusService.on("logout", () => {
      this.logout();
    });
  }

  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }


  logout(): void {
    this.tokenStorageService.logout();
    this.isLoggedIn = false;
  }
}
