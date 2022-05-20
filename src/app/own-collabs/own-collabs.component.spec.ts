import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnCollabsComponent } from './own-collabs.component';

describe('OwnCollabsComponent', () => {
  let component: OwnCollabsComponent;
  let fixture: ComponentFixture<OwnCollabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnCollabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnCollabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
