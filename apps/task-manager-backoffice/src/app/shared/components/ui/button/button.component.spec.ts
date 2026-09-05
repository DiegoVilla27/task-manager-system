import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let debug: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonComponent],
    });

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should render with full width', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button = debug.query(By.css('button'));

    expect(button.classes['w-full']).toBeTrue();
  });

  it('should emit callback when user clicked', () => {
    const emitSpy = spyOn(component.clicked, 'emit');

    const button = debug.query(By.css('button'));
    button.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
