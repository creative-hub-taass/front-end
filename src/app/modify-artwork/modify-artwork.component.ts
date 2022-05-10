
import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Artwork, Attributes} from "../../_models/Artwork";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {TokenStorageService} from "../_services/token-storage.service";
import {Creation} from "../../_models/Publication";


export class CreationArtwork implements Creation {
  id: string;
  user: string;
  nickname: string;
  creationType: string;
  artworkId: string;

  constructor(id: string, artworkId: string, user: string, nickname: string, creationType: string) {
    this.id = id;
    this.user = user;
    this.nickname = nickname;
    this.creationType = creationType;
    this.artworkId = artworkId;
  }
}

@Component({
  selector: 'app-modify-artwork',
  templateUrl: './modify-artwork.component.html',
  styleUrls: ['./modify-artwork.component.css']
})

export class ModifyArtworkComponent implements OnInit, OnDestroy {

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
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.artworkId = this.route.snapshot.paramMap.get("id");
    if (this.artworkId != null) {
      this.publicationService.getArtwork(this.artworkId).subscribe(
        (artwork: Artwork) => {
          window.sessionStorage.setItem("artworkOrigin", JSON.stringify(artwork));
          this.artworkResult = new Artwork(artwork);
          this.listUsersID = new Array<string>();
          this.artworkResult.creations.forEach((creation) => {
            this.listUsersID.push(creation.user);
          });

          this.listKey = new Array<string>();
          for (let key in this.artworkResult.attributes) {
            this.listKey.push(key);
          }

          this.buildFormArtworkOrigin()

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
      this.buildFormArtworkEmpty();
      this.listCreationArtwork = new Array<CreationArtwork>();
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

  ngOnDestroy(): void {
    window.sessionStorage.removeItem("artworkOrigin");
  }

  private buildFormArtworkOrigin() {
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


  private buildFormArtworkEmpty() {
    this.artworkResult = {
      id: "",
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      creations: [],
      attributes: {},
      images: [],
      creationDateTime: new Date().toISOString(),
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
  }


  private buildCreations() {
    this.listUsers.forEach((user) => {
      let index: number = this.artworkResult.creations.findIndex((Object) => {
        return Object.user == user.id;
      });
      this.listCreationArtwork = new Array<CreationArtwork>();
      this.listCreationArtwork.push(new CreationArtwork(this.artworkResult.creations[index].id, this.artworkResult.id, user.id, user.nickname, this.artworkResult.creations[index].creationType));
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

  }

  public addAttributes() {
    if (this.listKey.indexOf(this.formAttributes.key, 0) != -1) return;
    this.listKey.push(this.formAttributes.key);
    this.artworkResult.attributes[this.formAttributes.key] = this.formAttributes.value;
  }

  public addImages() {
    if (this.artworkResult.images.indexOf(this.formImages.images) != -1) return;
    this.artworkResult.images.push(this.formImages.images);
  }

  public addUsers() {
    if (this.formCreations.user == undefined) return;
    let tmpCreation: any = {};
    if (this.artworkId != null) {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        artworkId: this.artworkId
      }
    } else {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        artworkId: ""
      }
    }
    let index = this.listCreationArtwork.findIndex((elementCreationArtwork) => {
      return elementCreationArtwork.id == tmpCreation.id;
    });
    if (index != -1) return;
    //indice dell'utente dalla lista dei follower con l'id selezionato nella view
    //utile per prendere il nickname dell'utente inserito
    let indexUser = this.listFollowers.findIndex((elementFollower) => {
      return elementFollower.id == tmpCreation.user;
    })

    this.listCreationArtwork.push(new CreationArtwork("", tmpCreation.artworkId, tmpCreation.user, this.listFollowers[indexUser].nickname, this.formCreations.creationType));
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

  }

  public resetForm() {
    const artworkOrigin = window.sessionStorage.getItem("artworkOrigin");
    if (!artworkOrigin) this.buildFormArtworkEmpty;
    if (artworkOrigin) this.artworkResult = Object.assign<Artwork, Artwork>(this.artworkResult, JSON.parse(artworkOrigin))
    //aggiorno this.listkey con le chiavi degli attributi
    this.listKey = new Array<string>();
    for (let key in this.artworkResult.attributes) this.listKey.push(key);
    this.buildFormArtworkOrigin();
  }

  onSubmit() {
    const artwork = window.sessionStorage.getItem("artworkOrigin");
    //aggiorno il lastUpdate
    this.artworkResult.lastUpdate = new Date().toISOString();
    //devo eseguire una PUT al server per aggiornare l'artwork
    if (artwork) {
      //mando nella richiesta solo le creation non presenti nell'artwork di origine
      let artworkObj: Artwork = JSON.parse(artwork);
      this.artworkResult.creations.forEach((elementCreation) => {
        let index = artworkObj.creations.findIndex((elementOriginCreation) => {
          return elementOriginCreation.user == elementCreation.user;
        });
        console.log(index);
        console.log(artworkObj);
        console.log(this.artworkResult);
        if (index == -1) {
          this.publicationService.saveArtworkCreation(elementCreation).subscribe(
            (result) => {
              console.log(result);
            },
            (error) => {
              utility.onError(error, this.eventBusService);
            }
          );
        }
      });
      //mando richieste di eliminazione delle creation presenti nell'artwork originale
      artworkObj.creations.forEach((elementOriginCreation) => {
        let index = this.artworkResult.creations.findIndex((elementCreation) => {
          return elementCreation.id == elementOriginCreation.id;
        });
        if (index == -1) {
          this.publicationService.deleteArtworkCreation(elementOriginCreation.id)
        }
      });
      this.publicationService.updateArtwork(this.artworkResult);
      this.sent = true;
      return;
    }
    //altrimenti devo eseguire una POST per creare l'artwork
    this.publicationService.saveArtwork(this.artworkResult).subscribe(
      (responseArtwork) => {
        this.listCreationArtwork.forEach(elementCreation => {
          elementCreation.artworkId = responseArtwork.id;
          this.publicationService.saveArtworkCreation(elementCreation).subscribe(
            (responseCreation) => {
              console.log(responseCreation);
            }, (error) => {
              utility.onError(error, this.eventBusService);
            }
          );
        });
        this.router.navigate(['modify-artwork/' + responseArtwork.id]);
      }, (error) => {
        utility.onError(error, this.eventBusService);
      }
    )
  }
}
