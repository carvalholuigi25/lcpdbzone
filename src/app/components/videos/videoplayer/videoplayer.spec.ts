import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Videoplayer } from './videoplayer';

describe('Videoplayer', () => {
  let component: Videoplayer;
  let fixture: ComponentFixture<Videoplayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Videoplayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Videoplayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
