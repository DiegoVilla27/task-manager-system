import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';
import { UserResponse, UsersPagination } from '../interfaces/response';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;

  const mockUser: UserResponse = {
    id: 'usr-1',
    name: 'Camila',
    lastname: 'Rodriguez',
    email: 'camila@example.com',
    countTasks: 3,
    createdAt: '2026-01-01',
  };

  const mockPagination: UsersPagination = {
    content: [mockUser],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('users', mockPagination);
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit event when edit button is clicked', () => {
    let editedUser: UserResponse | undefined;
    component.edit.subscribe((u) => {
      editedUser = u;
    });

    const editBtn = fixture.nativeElement.querySelector(
      'button[aria-label^="Editar"]',
    );
    editBtn.click();
    fixture.detectChanges();

    expect(editedUser).toEqual(mockUser);
  });

  it('should emit delete event when delete button is clicked', () => {
    let deletedUser: UserResponse | undefined;
    component.delete.subscribe((u) => {
      deletedUser = u;
    });

    const deleteBtn = fixture.nativeElement.querySelector(
      'button[aria-label^="Eliminar"]',
    );
    deleteBtn.click();
    fixture.detectChanges();

    expect(deletedUser).toEqual(mockUser);
  });

  it('should render empty state when users content is empty', () => {
    fixture.componentRef.setInput('users', {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });
    fixture.detectChanges();

    const emptyTd = fixture.nativeElement.querySelector('td.text-center');
    expect(emptyTd.textContent).toContain('No se encontraron usuarios');
  });
});
