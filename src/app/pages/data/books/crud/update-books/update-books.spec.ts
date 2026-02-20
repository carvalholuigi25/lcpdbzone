import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBooks } from './update-books';

describe('UpdateBooks', () => {
  let component: UpdateBooks;
  let fixture: ComponentFixture<UpdateBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBooks]
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
