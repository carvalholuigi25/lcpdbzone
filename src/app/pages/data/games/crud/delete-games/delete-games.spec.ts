import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGames } from './delete-games';
import { ActivatedRoute } from '@angular/router';

describe('DeleteGames', () => {
  let component: DeleteGames;
  let fixture: ComponentFixture<DeleteGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGames],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              userDetails: {
                id: 1,
                username: 'testuser',
                email: '',
                role: 'admin',
                token: 'testtoken'
              }
            }
          }
        }
      }]
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
