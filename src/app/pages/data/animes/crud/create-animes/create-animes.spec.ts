import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnimes } from './create-animes';
import { ActivatedRoute } from '@angular/router';

describe('CreateAnimes', () => {
  let component: CreateAnimes;
  let fixture: ComponentFixture<CreateAnimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnimes],
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

    fixture = TestBed.createComponent(CreateAnimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
