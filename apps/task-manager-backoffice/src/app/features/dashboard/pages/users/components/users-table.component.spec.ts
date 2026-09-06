import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';
import { By } from '@angular/platform-browser';
import { PageUserResponse, UserResponse } from '@task-manager-system/api-types';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;

  const mockUser: UserResponse = {
    id: 'user-1',
    name: 'Diego',
    lastname: 'Villa',
    email: 'diego@taskmanager.com',
    countTasks: 3,
    createdAt: '2026-08-20',
  };

  const mockUsersPagination: PageUserResponse = {
    content: [mockUser],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersTableComponent],
    });

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('users', mockUsersPagination);
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();
  });

  it('should create and render user row', () => {
    expect(component).toBeTruthy();
    const nameEl = fixture.debugElement.query(
      By.css('.font-semibold.text-white'),
    );
    expect(nameEl.nativeElement.textContent).toContain('Diego Villa');
  });

  it('should emit edit and delete outputs when action buttons are clicked', () => {
    const editSpy = spyOn(component.edit, 'emit');
    const deleteSpy = spyOn(component.delete, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('tbody button'));
    expect(buttons.length).toBe(2);

    buttons[0].nativeElement.click();
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(editSpy).toHaveBeenCalledWith(mockUser);
    expect(deleteSpy).toHaveBeenCalledWith(mockUser);
  });

  it('should render empty state message if no users found', () => {
    fixture.componentRef.setInput('users', {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });
    fixture.detectChanges();

    const emptyCell = fixture.debugElement.query(By.css('td[colspan="6"]'));
    expect(emptyCell).toBeTruthy();
    expect(emptyCell.nativeElement.textContent).toContain(
      'No se encontraron usuarios',
    );
  });
});
