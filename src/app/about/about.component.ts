import {Component, OnInit} from '@angular/core';
import {PublicUser} from "../../_models/PublicUser";
import {EventBusService} from "../../_shared/event-bus.service";
import {CreatorService} from "../_services/creator.service";
import {ActivatedRoute} from "@angular/router";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  sameId: boolean = false;
  userId!: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string | undefined;

  constructor(
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
    if(this.userId != null){
      let userStorage: string | null = window.sessionStorage.getItem(this.userId);
      if(userStorage != null){
        this.user = new PublicUser(JSON.parse(userStorage));
        this.creator = new PublicCreator(this.user);
      }
    }
    this.sameId = (this.tokenStorageService.getUser().id == this.userId);
  }

  ngOnInit(): void {
    if (this.userId == null) {
      this.errorMessage = "Errore";
      return;
    }
    if(this.user != null) return;
    this.creatorService.getCreator(this.userId).subscribe(
      (publicUser) => {
        this.user = new PublicUser(publicUser);
        this.creator = new PublicCreator(this.user.creator);
      }, (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    );
  }

}
