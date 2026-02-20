import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGames } from './delete-games';

describe('DeleteGames', () => {
  let component: DeleteGames;
  let fixture: ComponentFixture<DeleteGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
