import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBooks } from './delete-books';
import { ActivatedRoute } from '@angular/router';

describe('DeleteBooks', () => {
  let component: DeleteBooks;
  let fixture: ComponentFixture<DeleteBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBooks],
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

    fixture = TestBed.createComponent(DeleteBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
