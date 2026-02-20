import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTvseries } from './delete-tvseries';

describe('DeleteTvseries', () => {
  let component: DeleteTvseries;
  let fixture: ComponentFixture<DeleteTvseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTvseries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTvseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
