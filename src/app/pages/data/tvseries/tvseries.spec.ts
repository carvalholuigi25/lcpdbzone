import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tvseries } from './tvseries';
import { ActivatedRoute } from '@angular/router';

describe('Tvseries', () => {
  let component: Tvseries;
  let fixture: ComponentFixture<Tvseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tvseries],
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

    fixture = TestBed.createComponent(Tvseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
