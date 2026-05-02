import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdmin } from './sidebar-admin';
import { ActivatedRoute } from '@angular/router';

describe('SidebarAdmin', () => {
  let component: SidebarAdmin;
  let fixture: ComponentFixture<SidebarAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAdmin],
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

    fixture = TestBed.createComponent(SidebarAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
