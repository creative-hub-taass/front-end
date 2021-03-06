import {Component, OnDestroy} from "@angular/core";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Artwork, Attributes} from "../../_models/Artwork";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {TokenStorageService} from "../_services/token-storage.service";
import {Creation} from "../../_models/Publication";
import {CreationType, Currency, getListCreationTypeAP, getListCurrency} from "../../_models/Enum";

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
  selector: "app-modify-artwork",
  templateUrl: "./modify-artwork.component.html",
  styleUrls: ["./modify-artwork.component.css"]
})

export class ModifyArtworkComponent implements OnDestroy {

  sent: boolean = false;
  artworkId: string | null;
  artworkResult!: Artwork;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  errorMessage: string = "";
  listKey!: string[];
  listFollowers!: PublicUser[];


  listCreationArtwork!: CreationArtwork[];

  formArtwork: {
    attributes: Attributes;
    availableCopies: number | undefined;
    copies: number;
    currency: Currency | undefined;
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
    creationType: CreationType;
  } = {
    creationType: CreationType.OTHER
  };

  onSale: boolean = false;

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.artworkId = this.route.snapshot.paramMap.get("id");
    if (this.tokenStorageService.getUser().id == null) {
      window.location.replace("/login");
      return;
    }
    if (this.tokenStorageService.getUser().creator == null) {
      window.location.replace("/upgrade-request");
      return;
    }
    if (this.artworkId != null) {
      this.publicationService.getArtwork(this.artworkId).subscribe({
        next: (artwork: Artwork) => {
          window.sessionStorage.setItem("artworkOrigin", JSON.stringify(artwork));
          this.artworkResult = new Artwork(artwork);
          this.onSale = artwork.onSale;
          this.listUsersID = new Array<string>();
          this.artworkResult.creations.forEach((creation) => {
            this.listUsersID.push(creation.user);
          });
          this.listKey = new Array<string>();
          for (let key in this.artworkResult.attributes) {
            this.listKey.push(key);
          }
          this.buildFormArtworkOrigin();
          this.publicationService.getListofUser(this.listUsersID).subscribe({
            next: (usersList: PublicUser[]) => {
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((publicUser) => {
                this.listUsers.push(new PublicUser(publicUser));
              });
              this.buildCreations();
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
    } else {
      this.listKey = new Array<string>();
      this.buildFormArtworkEmpty();
      this.listCreationArtwork = new Array<CreationArtwork>();
    }
    this.publicationService.getListFollower(this.tokenStorageService.getUser().id).subscribe({
      next: (listFollower: PublicUser[]) => {
        this.listFollowers = new Array<PublicUser>();
        listFollower.forEach((follower: PublicUser) => {
          if (follower.creator!=null) this.listFollowers.push(new PublicUser(follower));
        });
        this.listFollowers.push(this.tokenStorageService.getUser());
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
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

  public addUsers() {
    if (this.formCreations.user == undefined) return;
    let tmpCreation: any = {};
    if (this.artworkId != null) {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        artworkId: this.artworkId
      };
    } else {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        artworkId: ""
      };
    }
    let index = this.listCreationArtwork.findIndex((elementCreationArtwork) => {
      return elementCreationArtwork.user == tmpCreation.user;
    });
    if (index != -1) return;
    //indice dell'utente dalla lista dei follower con l'id selezionato nella view
    //utile per prendere il nickname dell'utente inserito
    let indexUser = this.listFollowers.findIndex((elementFollower) => {
      return elementFollower.id == tmpCreation.user;
    });
    this.listCreationArtwork.push(new CreationArtwork("", tmpCreation.artworkId, tmpCreation.user, this.listFollowers[indexUser].nickname, this.formCreations.creationType));
  }


  private buildCreations() {
    this.listCreationArtwork = new Array<CreationArtwork>();
    this.listUsers.forEach((user) => {
      let index: number = this.artworkResult.creations.findIndex((elementCreation) => {
        return elementCreation.user == user.id;
      });
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

  public resetForm() {
    const artworkOrigin = window.sessionStorage.getItem("artworkOrigin");
    if (!artworkOrigin) this.buildFormArtworkEmpty;
    else this.artworkResult = Object.assign<Artwork, Artwork>(this.artworkResult, JSON.parse(artworkOrigin));
    //aggiorno this.listkey con le chiavi degli attributi
    this.listKey = new Array<string>();
    for (let key in this.artworkResult.attributes) this.listKey.push(key);
    this.buildFormArtworkOrigin();
    this.onSale = this.artworkResult.onSale;
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
    const index = this.listCreationArtwork.findIndex((elementCreationArtwork) => {
      return elementCreationArtwork.id == user;
    });
    this.listCreationArtwork.splice(index, 1);

  }

  onCheckChange(x: string) {
    this.formArtwork.onSale = x;
    this.artworkResult.onSale = (x == "true");
    this.onSale = (x == "true");
  }

  getCreation(): CreationType[] {
    return getListCreationTypeAP();
  }

  getCurrency(): Currency[] {
    return getListCurrency();
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
      currency: undefined,
      description: "",
      name: "",
      onSale: false,
      paymentEmail: "",
      price: 0,
      type: ""
    };
  }

  onSubmit() {

    if (!this.onSale) {
      this.artworkResult.paymentEmail = undefined;
      this.artworkResult.availableCopies = 0;
      this.artworkResult.price = undefined;
      this.artworkResult.currency = undefined;
    }
    const artwork = window.sessionStorage.getItem("artworkOrigin");
    //aggiorno il lastUpdate
    this.artworkResult.lastUpdate = new Date().toISOString();
    //devo eseguire una PUT al server per aggiornare l'artwork
    if (artwork) {
      this.updateArtwork();
    } else {
      this.saveArtwork();
    }
  }

  private updateArtwork() {
    this.publicationService.updateArtwork(this.artworkResult).subscribe({
      next: () => {
        console.log("Ho aggiornato il post correttamente");
        //mando nella richiesta solo le creation non presenti nell'artwork di origine
        this.listCreationArtwork.forEach((elementCreationNew) => {
          let index = this.artworkResult.creations.findIndex((elementCreationOrigin) => {
            return elementCreationOrigin.user == elementCreationNew.user;
          });
          if (index == -1) {
            this.publicationService.saveArtworkCreation(elementCreationNew).subscribe({
              next: () => {
                console.log("Ho salvato il creation");
              },
              error: (error) => {
                this.errorMessage = utility.onError(error, this.eventBusService);
              }
            });
          }
        });
        //mando richieste di eliminazione delle creation presenti nell'artwork originale
        this.artworkResult.creations.forEach((elementCreationOrigin) => {
          let index = this.listCreationArtwork.findIndex((elementCreationNew) => {
            return elementCreationNew.user == elementCreationOrigin.user;
          });
          if (index == -1) {
            this.publicationService.deleteArtworkCreation(elementCreationOrigin.id).subscribe({
              next: () => {
                console.log("Creation eliminata con successo");
              },
              error: (error) => {
                this.errorMessage = utility.onError(error, this.eventBusService);
              }
            });
          }
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.sent = true;
  }

  private saveArtwork() {
    //altrimenti devo eseguire una POST per creare l'artwork
    this.publicationService.saveArtwork(this.artworkResult).subscribe({
      next: (responseArtwork) => {
        this.listCreationArtwork.forEach(elementCreation => {
          elementCreation.artworkId = responseArtwork.id;
          this.publicationService.saveArtworkCreation(elementCreation).subscribe({
            next: (responseCreation) => {
              console.log(responseCreation);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        });
        this.router.navigate(["artwork/" + responseArtwork.id]);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

}
