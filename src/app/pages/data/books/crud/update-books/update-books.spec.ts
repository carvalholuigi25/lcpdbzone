import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBooks } from './update-books';
import { ActivatedRoute } from '@angular/router';

describe('UpdateBooks', () => {
  let component: UpdateBooks;
  let fixture: ComponentFixture<UpdateBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBooks],
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

    fixture = TestBed.createComponent(UpdateBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
