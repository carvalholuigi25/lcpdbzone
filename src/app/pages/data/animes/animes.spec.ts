import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Animes } from './animes';
import { ActivatedRoute } from '@angular/router';

describe('Animes', () => {
  let component: Animes;
  let fixture: ComponentFixture<Animes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Animes],
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

    fixture = TestBed.createComponent(Animes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
