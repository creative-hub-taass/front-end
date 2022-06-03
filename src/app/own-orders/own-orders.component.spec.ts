import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnOrdersComponent } from './own-orders.component';

describe('OwnOrdersComponent', () => {
  let component: OwnOrdersComponent;
  let fixture: ComponentFixture<OwnOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
