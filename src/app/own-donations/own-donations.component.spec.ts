import {ComponentFixture, TestBed} from "@angular/core/testing";

import {OwnDonationsComponent} from "./own-donations.component";

describe("OwnDonationsComponent", () => {
  let component: OwnDonationsComponent;
  let fixture: ComponentFixture<OwnDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnDonationsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
