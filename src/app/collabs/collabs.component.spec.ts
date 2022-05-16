import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CollabsComponent} from './collabs.component';

describe('CollabsComponent', () => {
  let component: CollabsComponent;
  let fixture: ComponentFixture<CollabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollabsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
