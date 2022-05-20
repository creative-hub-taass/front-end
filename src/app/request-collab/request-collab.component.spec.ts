import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCollabComponent } from './request-collab.component';

describe('RequestCollabComponent', () => {
  let component: RequestCollabComponent;
  let fixture: ComponentFixture<RequestCollabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestCollabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
