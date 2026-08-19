import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersHeaderComponent } from './users-header.component';

describe('UsersHeaderComponent', () => {
  let component: UsersHeaderComponent;
  let fixture: ComponentFixture<UsersHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit exportCsvClicked when Exportar CSV button is clicked', () => {
    let clicked = false;
    component.exportCsvClicked.subscribe(() => {
      clicked = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    fixture.detectChanges();

    expect(clicked).toBeTrue();
  });

  it('should emit newUserClicked when Nuevo Usuario button is clicked', () => {
    let clicked = false;
    component.newUserClicked.subscribe(() => {
      clicked = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    fixture.detectChanges();

    expect(clicked).toBeTrue();
  });
});
