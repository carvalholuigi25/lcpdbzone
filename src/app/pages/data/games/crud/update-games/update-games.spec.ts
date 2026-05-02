import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGames } from './update-games';
import { ActivatedRoute } from '@angular/router';

describe('UpdateGames', () => {
  let component: UpdateGames;
  let fixture: ComponentFixture<UpdateGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGames],
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

    fixture = TestBed.createComponent(UpdateGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
