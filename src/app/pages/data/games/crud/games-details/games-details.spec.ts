import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesDetails } from './games-details';
import { ActivatedRoute } from '@angular/router';

describe('GamesDetails', () => {
  let component: GamesDetails;
  let fixture: ComponentFixture<GamesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesDetails],
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

    fixture = TestBed.createComponent(GamesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
