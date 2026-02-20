import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGames } from './create-games';

describe('CreateGames', () => {
  let component: CreateGames;
  let fixture: ComponentFixture<CreateGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
