import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalComponent],
    });

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should attach modal to body when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Modal de Prueba');
    fixture.componentRef.setInput('subtitle', 'Subtítulo del modal');
    fixture.detectChanges();

    const portalHost = document.querySelector('.app-modal-portal-host');
    expect(portalHost).toBeTruthy();

    const titleEl = portalHost?.querySelector('#modal-title');
    expect(titleEl?.textContent).toContain('Modal de Prueba');
  });

  it('should emit closed event on close button click', () => {
    const closedSpy = spyOn(component.closed, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Modal');
    fixture.detectChanges();

    const portalHost = document.querySelector('.app-modal-portal-host');
    const closeBtn = portalHost?.querySelector(
      'button[aria-label="Cerrar modal"]',
    ) as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn?.click();
    fixture.detectChanges();

    expect(closedSpy).toHaveBeenCalled();
  });

  it('should emit closed on backdrop click', () => {
    const closedSpy = spyOn(component.closed, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const portalHost = document.querySelector('.app-modal-portal-host');
    const backdrop = portalHost?.querySelector(
      'button.backdrop-blur-sm',
    ) as HTMLButtonElement;
    backdrop?.click();
    fixture.detectChanges();

    expect(closedSpy).toHaveBeenCalled();
  });

  it('should detach and clean up portal on destroy or when isOpen becomes false', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    expect(document.querySelector('.app-modal-portal-host')).toBeTruthy();

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
  });
});
