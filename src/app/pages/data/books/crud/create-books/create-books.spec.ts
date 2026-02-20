import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBooks } from './create-books';

describe('CreateBooks', () => {
  let component: CreateBooks;
  let fixture: ComponentFixture<CreateBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBooks]
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
