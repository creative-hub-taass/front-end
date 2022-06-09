import {ComponentFixture, TestBed} from "@angular/core/testing";

import {OwnUpgradesComponent} from "./own-upgrades.component";

describe("OwnUpgradesComponent", () => {
  let component: OwnUpgradesComponent;
  let fixture: ComponentFixture<OwnUpgradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnUpgradesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnUpgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
