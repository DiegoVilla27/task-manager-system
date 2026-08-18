import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginBrandComponent } from './login-brand.component';

describe('LoginBrandComponent', () => {
  let component: LoginBrandComponent;
  let fixture: ComponentFixture<LoginBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginBrandComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display brand title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('TaskManager');
  });
});
