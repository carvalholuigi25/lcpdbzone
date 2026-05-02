import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAnimes } from './delete-animes';
import { ActivatedRoute } from '@angular/router';

describe('DeleteAnimes', () => {
  let component: DeleteAnimes;
  let fixture: ComponentFixture<DeleteAnimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAnimes],
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

    fixture = TestBed.createComponent(DeleteAnimes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
