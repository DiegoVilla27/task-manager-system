import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Ensure body cleanup
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should attach to body when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Modal Test');
    fixture.detectChanges();

    const titleEl = document.body.querySelector('#modal-title');
    expect(titleEl).toBeTruthy();
    expect(titleEl?.textContent).toContain('Modal Test');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should emit closed event when close button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('showCloseButton', true);
    fixture.detectChanges();

    let closedEmitted = false;
    component.closed.subscribe(() => {
      closedEmitted = true;
    });

    const closeBtn = document.body.querySelector(
      'button[aria-label="Cerrar modal"]',
    ) as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn?.click();

    expect(closedEmitted).toBeTrue();
  });

  it('should detach from body when isOpen becomes false', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const titleEl = document.body.querySelector('#modal-title');
    expect(titleEl).toBeFalsy();
    expect(document.body.style.overflow).toBe('');
  });
});
