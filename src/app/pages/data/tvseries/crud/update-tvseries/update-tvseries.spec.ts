import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTvseries } from './update-tvseries';
import { ActivatedRoute } from '@angular/router';

describe('UpdateTvseries', () => {
  let component: UpdateTvseries;
  let fixture: ComponentFixture<UpdateTvseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTvseries],
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

    fixture = TestBed.createComponent(UpdateTvseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
