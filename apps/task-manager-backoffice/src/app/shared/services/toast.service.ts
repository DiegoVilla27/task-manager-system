import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ApiFieldError } from '@task-manager-system/api-types';

/**
 * Service responsible for orchestrating dynamic UI Toast notifications and dialog popups.
 *
 * @remarks
 * Generates temporary, animated, and stylized notification blocks or confirmation modals in the browser DOM.
 * Integrates platform safety checks for server-side rendering (SSR) compatibility.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /** Platform identifier token used to safeguard DOM access during SSR operations. */
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Spawns a new temporary, animated toast notification in the DOM.
   *
   * @remarks
   * This action is ignored during Server-Side Rendering (SSR) to prevent runtime document exceptions.
   *
   * @param message - The primary message title text to display.
   * @param type - Visual indicator variant: 'success' (purple indicator) or 'error' (rose indicator).
   * @param duration - Lifespan of the toast element in milliseconds before dismissal animation triggers.
   * @param errors - Optional mapping list or object details to render list items beneath the title.
   *
   * @example
   * ```typescript
   * toast.show('Failed to save record', 'error', 4000, { email: 'Email already exists' });
   * ```
   */
  show(
    message: string,
    type: 'success' | 'error' = 'success',
    duration = 3000,
    errors?: ApiFieldError[],
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const toast = document.createElement('div');

    const baseClasses = [
      'fixed',
      'bottom-6',
      'left-6',
      'z-50',
      'flex',
      'items-start',
      'gap-3',
      'px-4.5',
      'py-4',
      'rounded-xl',
      'max-w-md',
      'w-full',
      'sm:w-[380px]',
      'border',
      'text-sm',
      'font-medium',
      'shadow-[0_12px_40px_rgba(0,0,0,0.7)]',
      'transition-all',
      'duration-300',
      'ease-out',
      'translate-y-4',
      'opacity-0',
    ];

    const typeClasses =
      type === 'success'
        ? ['bg-zinc-950/95', 'border-purple-500/35', 'text-purple-300']
        : ['bg-zinc-950/95', 'border-rose-500/35', 'text-rose-300'];

    toast.classList.add(...baseClasses, ...typeClasses);

    const ledColor = type === 'success' ? 'bg-purple-500' : 'bg-rose-500';

    const errorsListHtml = errors?.length
      ? `
        <ul class="mt-2 text-xs text-rose-400/90 space-y-1 list-disc pl-4 font-sans tracking-wide">
          ${errors
            .map(({ field, message }) => {
              const formattedField =
                field!.charAt(0).toUpperCase() + field!.slice(1);
              return `<li>${formattedField}: ${message}</li>`;
            })
            .join('')}
        </ul>
      `
      : '';

    toast.innerHTML = `
      <span
        class="flex h-1.5 w-1.5 shrink-0 rounded-full ${ledColor}
        shadow-[0_0_8px_currentColor] mt-1.5">
      </span>

      <div class="flex-1 min-w-0">
        <span
          class="tracking-tight text-zinc-200 block font-semibold">
          ${message}
        </span>

        ${errorsListHtml}
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  /**
   * Helper shortcut to invoke a successful status notification.
   *
   * @param message - The success status title message.
   * @param duration - Visual display duration in milliseconds before dismissal.
   */
  success(message: string, duration = 5000) {
    this.show(message, 'success', duration);
  }

  /**
   * Helper shortcut to invoke an error status notification.
   *
   * @param message - The error status title message.
   * @param errors - Optional mapping list or object details to render list items beneath the title.
   * @param duration - Visual display duration in milliseconds before dismissal.
   */
  error(message: string, errors?: ApiFieldError[], duration = 5000): void {
    this.show(message, 'error', duration, errors);
  }

  /**
   * Spawns an interactive confirmation dialog backdrop popup in the viewport DOM.
   *
   * @remarks
   * This modal yields code execution blocks by returning a Promise.
   *
   * @param title - The dialog header title text.
   * @param message - Descriptive contextual notification explanation.
   * @param confirmText - Content label of the positive confirmation button.
   * @param cancelText - Content label of the negative cancellation button.
   * @returns A promise resolving to `true` if the user confirms, and `false` if they cancel.
   *
   * @example
   * ```typescript
   * const confirmed = await toast.confirm('Delete Item', 'Are you sure?');
   * if (confirmed) {
   *   // Proceed with action...
   * }
   * ```
   */
  confirm(
    title: string,
    message: string,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve(false);
        return;
      }

      // 1. Crear el contenedor del Backdrop (fondo oscuro que bloquea clics)
      const backdrop = document.createElement('div');
      const backdropClasses = [
        'fixed',
        'inset-0',
        'z-50',
        'flex',
        'items-center',
        'justify-center',
        'p-4',
        'bg-zinc-950/60',
        'backdrop-blur-sm',
        'transition-opacity',
        'duration-300',
        'ease-out',
        'opacity-0',
      ];
      backdrop.classList.add(...backdropClasses);

      // 2. Crear la tarjeta del Popup (Estilo minimalista oscuro premium)
      const card = document.createElement('div');
      const cardClasses = [
        'bg-zinc-950',
        'border',
        'border-zinc-900',
        'rounded-2xl',
        'p-6',
        'max-w-md',
        'w-full',
        'shadow-[0_24px_50px_rgba(0,0,0,0.8)]',
        'transition-all',
        'duration-300',
        'ease-out',
        'scale-95',
        'opacity-0',
      ];
      card.classList.add(...cardClasses);

      // Estructura interna con clases de tu paleta
      card.innerHTML = `
      <h3 class="text-base font-semibold text-zinc-100 font-sans tracking-tight">${title}</h3>
      <p class="mt-2 text-sm text-zinc-400 leading-relaxed font-sans">${message}</p>
      <div class="mt-6 flex items-center justify-end gap-2">
        <button id="popup-cancel" type="button" class="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-900/40 border border-zinc-800/80 rounded-xl hover:text-zinc-200 transition-all duration-200 font-mono">
          ${cancelText}
        </button>
        <button id="popup-confirm" type="button" class="relative group overflow-hidden rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 hover:scale-[1.02] font-mono">
          ${confirmText}
        </button>
      </div>
    `;

      backdrop.appendChild(card);
      document.body.appendChild(backdrop);

      // Animación de entrada
      setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
      }, 10);

      // Función de cierre con animación
      const closePopup = (result: boolean) => {
        card.classList.remove('scale-100', 'opacity-100');
        card.classList.add('scale-95', 'opacity-0');
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');

        setTimeout(() => {
          backdrop.remove();
          resolve(result); // Resolvemos el Promise con la decisión del usuario
        }, 300);
      };

      // Listeners de los botones creados en el innerHTML
      backdrop
        .querySelector('#popup-cancel')
        ?.addEventListener('click', () => closePopup(false));
      backdrop
        .querySelector('#popup-confirm')
        ?.addEventListener('click', () => closePopup(true));
    });
  }
}
