import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the users list component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial mock users', () => {
    expect(component.users().length).toBeGreaterThan(0);
  });

  it('should open and close create modal', () => {
    expect(component.isCreateModalOpen()).toBeFalse();
    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBeTrue();
    component.closeCreateModal();
    expect(component.isCreateModalOpen()).toBeFalse();
  });
});
