import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGames } from './update-games';

describe('UpdateGames', () => {
  let component: UpdateGames;
  let fixture: ComponentFixture<UpdateGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
