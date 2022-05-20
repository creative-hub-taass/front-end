import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModifyArtworkComponent} from './modify-artwork.component';

describe('ModifyArtworkComponent', () => {
  let component: ModifyArtworkComponent;
  let fixture: ComponentFixture<ModifyArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyArtworkComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
