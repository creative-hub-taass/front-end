import {Component, OnInit} from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import {ActivatedRoute} from "@angular/router";
import {Artwork, Attributes} from "../../_models/Artwork";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {TokenStorageService} from "../_services/token-storage.service";

export class CreationArtwork {
  id: string;
  nickname: string;
  creationType: string;

  constructor(id: string, nickname: string, creationType: string) {
    this.id = id;
    this.nickname = nickname;
    this.creationType = creationType;
  }
}

@Component({
  selector: 'app-modify-artwork',
  templateUrl: './modify-artwork.component.html',
  styleUrls: ['./modify-artwork.component.css']
})
export class ModifyArtworkComponent implements OnInit {

  updatedInfo: boolean = true;
  updatedUsers: boolean = true;

  sent: boolean = false;
  artworkId: string | null;
  artworkResult!: Artwork;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  errorMessage: string | undefined;
  listKey!: string[];

  listFollowers!: PublicUser[];

  listCreationArtwork!: CreationArtwork[];

  formArtwork: {
    attributes: Attributes;
    availableCopies: number | undefined;
    copies: number;
    currency: string | undefined;
    description: string;
    name: string;
    onSale: string;
    paymentEmail: string | undefined;
    price: number | undefined;
    type: string;
  } = {
    attributes: {},
    availableCopies: undefined,
    copies: 0,
    currency: undefined,
    description: "",
    name: "",
    onSale: "",
    paymentEmail: undefined,
    price: undefined,
    type: ""
  };

  formAttributes: {
    key: string;
    value: string;
  } = {
    key: "",
    value: ""
  };

  formImages: {
    images: string;
  } = {
    images: ""
  };

  formCreations: {
    user?: PublicUser;
    creationType: string;
  } = {
    creationType: ""
  };

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.artworkId = this.route.snapshot.paramMap.get("id");
    if (this.artworkId != null) {
      this.publicationService.getArtwork(this.artworkId).subscribe(
        (artwork: Artwork) => {
          window.sessionStorage.setItem("artworkOrigin",JSON.stringify(artwork));
          this.artworkResult = new Artwork(artwork);
          this.listUsersID = new Array<string>();
          this.artworkResult.creations.forEach((creation) => {
            this.listUsersID.push(creation.user);
          });

          this.listKey = new Array<string>();
          for (let key in this.artworkResult.attributes) {
            this.listKey.push(key);
          }

          this.buildFormArtwork()
          this.publicationService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((publicUser) => {
                this.listUsers.push(new PublicUser(publicUser));
              });
              this.buildCreations();
            },
            (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          );
        }
      );
    } else {
        this.listKey = new Array<string>();
      this.artworkResult = {
        id: "",
        timestamp: new Date(),
        lastUpdate: new Date(),
        creations: [],
        attributes: {},
        images: [],
        creationDateTime: new Date(),
        publicationType: "artwork",
        availableCopies: 0,
        copies: 0,
        currency: "",
        description: "",
        name: "",
        onSale: false,
        paymentEmail: "",
        price: 0,
        type: ""
      }
      this.listCreationArtwork = new Array<CreationArtwork>();
      this.updatedInfo = false;
      this.updatedUsers = false;
    }

    this.publicationService.getListFollower(this.tokenStorageService.getUser().id).subscribe(
      (listFollower: PublicUser[]) => {
        this.listFollowers = new Array<PublicUser>();
        listFollower.forEach((follower) => {
          this.listFollowers.push(new PublicUser(follower));
        });
      },
      (error) => {
        utility.onError(error, this.eventBusService);
      }
    )
  }

  ngOnInit(): void {
  }

  private buildFormArtwork() {
    this.formArtwork.availableCopies = this.artworkResult.availableCopies;
    this.formArtwork.copies = this.artworkResult.copies;
    this.formArtwork.currency = this.artworkResult.currency;
    this.formArtwork.description = this.artworkResult.description;
    this.formArtwork.name = this.artworkResult.name;
    this.formArtwork.onSale = this.artworkResult.onSale ? "true" : "false";
    this.formArtwork.paymentEmail = this.artworkResult.paymentEmail;
    this.formArtwork.price = this.artworkResult.price;
    this.formArtwork.type = this.artworkResult.type;
  }


  private buildCreations() {
    this.listUsers.forEach((user) => {
      let index: number = this.artworkResult.creations.findIndex((Object) => {
        return Object.user == user.id;
      });
      this.listCreationArtwork = new Array<CreationArtwork>();
      this.listCreationArtwork.push(new CreationArtwork(user.id, user.nickname, this.artworkResult.creations[index].creationType));
    });
  }

  public addInformations() {
    this.artworkResult.availableCopies = (this.formArtwork.availableCopies != undefined) ? +this.formArtwork.availableCopies : 0;
    this.artworkResult.copies = +this.formArtwork.copies;
    this.artworkResult.currency = this.formArtwork.currency;
    this.artworkResult.description = this.formArtwork.description;
    this.artworkResult.name = this.formArtwork.name;
    this.artworkResult.onSale = (this.formArtwork.onSale == "true");
    this.artworkResult.paymentEmail = this.formArtwork.paymentEmail;
    this.artworkResult.price = (this.formArtwork.price != undefined) ? +this.formArtwork.price : undefined;
    this.artworkResult.type = this.formArtwork.type;
    this.updatedInfo = (!this.updatedInfo);
  }

  public addAttributes() {
    if (this.listKey.indexOf(this.formAttributes.key, 0) != -1) return;
    this.listKey.push(this.formAttributes.key);
    this.artworkResult.attributes[this.formAttributes.key] = this.formAttributes.value;
  }

  public addImages() {
    console.log(this.artworkResult.images);
    console.log(this.formImages);
    if (this.artworkResult.images.indexOf(this.formImages.images) != -1) return;
    this.artworkResult.images.push(this.formImages.images);
  }

  public addUsers() {
    if (this.formCreations.user == undefined) return;
    let tmpCreationArtwork = new CreationArtwork(this.formCreations.user.id, this.formCreations.user.nickname, this.formCreations.creationType);
    let index = this.listCreationArtwork.findIndex((elementCreationArtwork) => {
      return elementCreationArtwork.id == tmpCreationArtwork.id;
    });
    if (index != -1) return;
    this.artworkResult.creations.push({
      id: "",
      user: tmpCreationArtwork.id,
      creationType: tmpCreationArtwork.creationType
    });
    this.listCreationArtwork.push(tmpCreationArtwork);
    this.updatedUsers = (!this.updatedUsers);
  }

  public deleteAttribute(key: string) {
    const index = this.listKey.indexOf(key, 0);
    this.listKey.splice(index, 1);
    delete this.artworkResult.attributes[key];
  }

  public deleteImage(image: string) {
    const index = this.artworkResult.images.indexOf(image, 0);
    this.artworkResult.images.splice(index, 1);
  }

  public deleteUser(user: string) {
    const index = this.listCreationArtwork.findIndex((Object) => {
      return Object.id == user;
    });
    this.listCreationArtwork.splice(index, 1);
    this.updatedUsers =!(this.listCreationArtwork.length==0);
  }

  public resetForm() {
    const artworkOrigin= window.sessionStorage.getItem("artworkOrigin");
    if(!artworkOrigin) this.artworkResult
    if(artworkOrigin) this.artworkResult = Object.assign<Artwork,Artwork>(this.artworkResult,JSON.parse(artworkOrigin))
    //aggiorno this.listkey con le chiavi degli attributi
    this.listKey = new Array<string>();
    for (let key in this.artworkResult.attributes) this.listKey.push(key);
    this.buildCreations();
    this.buildFormArtwork();
  }

  onSubmit() {
    if(!this.updatedInfo || !this.updatedUsers) return;
    const artwork = window.sessionStorage.getItem("artworkOrigin");
    //aggiorno il lastUpdate
    this.artworkResult.lastUpdate = new Date();
    //devo eseguire una PUT al server per aggiornare l'artwork
    if(artwork) {
      this.publicationService.updateArtwork(this.artworkResult);
      this.sent = true;
      console.log(this.sent);
      return;
    }
    //altrimenti devo eseguire una POST per creare l'artwork
    this.publicationService.saveArtwork(this.artworkResult).subscribe(
      (response) => {
        this.sent = true;
        console.log(response);
      },
      (error) => { utility.onError(error, this.eventBusService); }
    )
  }

}
