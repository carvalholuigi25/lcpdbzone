import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGames } from './create-games';
import { ActivatedRoute } from '@angular/router';

describe('CreateGames', () => {
  let component: CreateGames;
  let fixture: ComponentFixture<CreateGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGames],
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

    fixture = TestBed.createComponent(CreateGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
