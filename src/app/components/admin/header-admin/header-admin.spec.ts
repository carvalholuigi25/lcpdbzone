import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAdmin } from './header-admin';
import { ActivatedRoute } from '@angular/router';

describe('HeaderAdmin', () => {
  let component: HeaderAdmin;
  let fixture: ComponentFixture<HeaderAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAdmin],
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

    fixture = TestBed.createComponent(HeaderAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
