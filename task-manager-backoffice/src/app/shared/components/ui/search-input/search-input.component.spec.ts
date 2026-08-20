import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { By } from '@angular/platform-browser';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchInputComponent],
    });

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize query with initial value', () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('value', 'texto inicial');
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.value).toBe('texto inicial');
  });

  it('should emit debounced searchChange on input', fakeAsync(() => {
    const searchChangeSpy = spyOn(component.searchChange, 'emit');
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = 'busqueda';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(searchChangeSpy).not.toHaveBeenCalled();

    tick(400);

    expect(searchChangeSpy).toHaveBeenCalledWith('busqueda');
  }));

  it('should clear query and emit cleared on clear button click', () => {
    const clearedSpy = spyOn(component.cleared, 'emit');
    const searchChangeSpy = spyOn(component.searchChange, 'emit');
    fixture.componentRef.setInput('value', 'consulta');
    fixture.detectChanges();

    const clearBtn = fixture.debugElement.query(
      By.css('button[aria-label="Limpiar búsqueda"]'),
    );
    expect(clearBtn).toBeTruthy();
    clearBtn.nativeElement.click();
    fixture.detectChanges();

    expect(clearedSpy).toHaveBeenCalled();
    expect(searchChangeSpy).toHaveBeenCalledWith('');
  });
});
