import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTvseries } from './delete-tvseries';
import { ActivatedRoute } from '@angular/router';

describe('DeleteTvseries', () => {
  let component: DeleteTvseries;
  let fixture: ComponentFixture<DeleteTvseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTvseries],
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

    fixture = TestBed.createComponent(DeleteTvseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
