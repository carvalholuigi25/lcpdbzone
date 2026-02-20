import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAnimes } from './delete-animes';

describe('DeleteAnimes', () => {
  let component: DeleteAnimes;
  let fixture: ComponentFixture<DeleteAnimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAnimes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAnimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
