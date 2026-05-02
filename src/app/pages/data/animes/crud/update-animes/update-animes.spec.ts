import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAnimes } from './update-animes';
import { ActivatedRoute } from '@angular/router';

describe('UpdateAnimes', () => {
  let component: UpdateAnimes;
  let fixture: ComponentFixture<UpdateAnimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAnimes],
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

    fixture = TestBed.createComponent(UpdateAnimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
