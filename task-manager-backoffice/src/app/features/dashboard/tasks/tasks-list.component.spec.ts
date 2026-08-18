import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent } from './tasks-list.component';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the tasks list component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial mock tasks', () => {
    expect(component.tasks().length).toBeGreaterThan(0);
  });

  it('should open and close create modal', () => {
    expect(component.isCreateModalOpen()).toBeFalse();
    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBeTrue();
    component.closeCreateModal();
    expect(component.isCreateModalOpen()).toBeFalse();
  });
});
