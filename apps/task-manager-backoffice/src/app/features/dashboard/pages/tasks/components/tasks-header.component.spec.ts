import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksHeaderComponent } from './tasks-header.component';
import { By } from '@angular/platform-browser';

describe('TasksHeaderComponent', () => {
  let component: TasksHeaderComponent;
  let fixture: ComponentFixture<TasksHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TasksHeaderComponent],
    });

    fixture = TestBed.createComponent(TasksHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and emit newTaskClicked on button click', () => {
    const newTaskClickedSpy = spyOn(component.newTaskClicked, 'emit');
    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();
    fixture.detectChanges();

    expect(newTaskClickedSpy).toHaveBeenCalled();
  });
});
