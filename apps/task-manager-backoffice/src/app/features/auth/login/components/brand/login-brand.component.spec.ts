import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginBrandComponent } from './login-brand.component';

describe('LoginBrandComponent', () => {
  let component: LoginBrandComponent;
  let fixture: ComponentFixture<LoginBrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginBrandComponent],
    });

    fixture = TestBed.createComponent(LoginBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render brand header title', () => {
    expect(component).toBeTruthy();
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('TaskManager Backoffice');
  });
});
