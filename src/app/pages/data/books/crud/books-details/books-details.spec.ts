import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksDetails } from './books-details';
import { ActivatedRoute } from '@angular/router';

describe('BooksDetails', () => {
  let component: BooksDetails;
  let fixture: ComponentFixture<BooksDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksDetails],
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

    fixture = TestBed.createComponent(BooksDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
