import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBooks } from './delete-books';

describe('DeleteBooks', () => {
  let component: DeleteBooks;
  let fixture: ComponentFixture<DeleteBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBooks]
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
