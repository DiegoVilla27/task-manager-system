import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersHeaderComponent } from './users-header.component';
import { By } from '@angular/platform-browser';

describe('UsersHeaderComponent', () => {
  let component: UsersHeaderComponent;
  let fixture: ComponentFixture<UsersHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersHeaderComponent],
    });

    fixture = TestBed.createComponent(UsersHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and emit newUserClicked on button click', () => {
    const newUserClickedSpy = spyOn(component.newUserClicked, 'emit');
    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();
    fixture.detectChanges();

    expect(newUserClickedSpy).toHaveBeenCalled();
  });
});
