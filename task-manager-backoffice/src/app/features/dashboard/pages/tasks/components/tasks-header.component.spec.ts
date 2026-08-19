import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksHeaderComponent } from './tasks-header.component';

describe('TasksHeaderComponent', () => {
  let component: TasksHeaderComponent;
  let fixture: ComponentFixture<TasksHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit newTaskClicked when Nueva Tarea button is clicked', () => {
    let clicked = false;
    component.newTaskClicked.subscribe(() => {
      clicked = true;
    });

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(clicked).toBeTrue();
  });
});
