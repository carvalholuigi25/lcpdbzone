import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Data } from './data';
import { ActivatedRoute } from '@angular/router';

describe('Data', () => {
  let component: Data;
  let fixture: ComponentFixture<Data>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Data],
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

    fixture = TestBed.createComponent(Data);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
