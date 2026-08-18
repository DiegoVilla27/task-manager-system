import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate initials from name correctly', () => {
    fixture.componentRef.setInput('name', 'Diego Villa');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text.trim()).toBe('DV');
  });

  it('should calculate single letter initial for single word name', () => {
    fixture.componentRef.setInput('name', 'Antigravity');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text.trim()).toBe('AN');
  });

  it('should use explicit initials if provided', () => {
    fixture.componentRef.setInput('initials', 'XY');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text.trim()).toBe('XY');
  });

  it('should render image if src is provided', () => {
    fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('should render status indicator dot when status is provided', () => {
    fixture.componentRef.setInput('status', 'online');
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('.rounded-full.ring-2');
    expect(dot).toBeTruthy();
  });
});
