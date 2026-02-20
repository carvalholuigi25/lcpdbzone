import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTvseries } from './create-tvseries';

describe('CreateTvseries', () => {
  let component: CreateTvseries;
  let fixture: ComponentFixture<CreateTvseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTvseries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTvseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
