import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimesDetails } from './animes-details';
import { ActivatedRoute } from '@angular/router';

describe('AnimesDetails', () => {
  let component: AnimesDetails;
  let fixture: ComponentFixture<AnimesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimesDetails],
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

    fixture = TestBed.createComponent(AnimesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
