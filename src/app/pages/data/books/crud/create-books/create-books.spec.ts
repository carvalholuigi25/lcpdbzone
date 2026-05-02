import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBooks } from './create-books';
import { ActivatedRoute } from '@angular/router';

describe('CreateBooks', () => {
  let component: CreateBooks;
  let fixture: ComponentFixture<CreateBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBooks],
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

    fixture = TestBed.createComponent(CreateBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
