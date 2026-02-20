import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Videojsplayer } from './videojsplayer';

describe('Videojsplayer', () => {
  let component: Videojsplayer;
  let fixture: ComponentFixture<Videojsplayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Videojsplayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Videojsplayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
