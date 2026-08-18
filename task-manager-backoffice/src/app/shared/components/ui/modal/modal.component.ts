import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ApplicationRef,
  EnvironmentInjector,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DomPortalOutlet,
  TemplatePortal,
  PortalModule,
} from '@angular/cdk/portal';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, PortalModule],
  template: `
    <ng-template #modalTemplate>
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="title() ? 'modal-title' : null"
        (keydown.escape)="handleClose()"
      >
        <!-- Backdrop Blur Overlay -->
        <button
          type="button"
          class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm border-0 w-full h-full cursor-default transition-opacity"
          (click)="handleClose()"
          aria-label="Cerrar modal"
        ></button>

        <!-- Modal Dialog Box -->
        <div
          class="relative w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          [class]="sizeClasses()"
        >
          <!-- Header -->
          @if (title() || showCloseButton()) {
            <div
              class="flex items-center justify-between pb-4 mb-6 border-b border-slate-800"
            >
              <div>
                @if (title()) {
                  <h3
                    id="modal-title"
                    class="text-xl font-bold text-white tracking-tight"
                  >
                    {{ title() }}
                  </h3>
                }
                @if (subtitle()) {
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ subtitle() }}
                  </p>
                }
              </div>

              @if (showCloseButton()) {
                <button
                  type="button"
                  (click)="handleClose()"
                  class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Body Content -->
          <div>
            <ng-content />
          </div>

          <!-- Footer Content (optional) -->
          <div class="mt-6">
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly vcr = inject(ViewContainerRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);

  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly size = input<ModalSize>('md');
  readonly showCloseButton = input<boolean>(true);

  readonly close = output<void>();

  protected readonly modalTemplate =
    viewChild<TemplateRef<unknown>>('modalTemplate');

  private portalOutlet: DomPortalOutlet | null = null;
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly sizeClasses = computed(() => {
    const sizes: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };
    return sizes[this.size()];
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const template = this.modalTemplate();

      if (!this.isBrowser) return;

      if (open && template) {
        this.attachToBody(template);
      } else {
        this.detachFromBody();
      }
    });
  }

  private attachToBody(template: TemplateRef<unknown>): void {
    if (!this.portalOutlet) {
      this.portalOutlet = new DomPortalOutlet(
        this.document.body,
        this.vcr,
        this.appRef,
        this.envInjector,
      );
    }

    if (!this.portalOutlet.hasAttached()) {
      const portal = new TemplatePortal(template, this.vcr);
      this.portalOutlet.attach(portal);
      this.document.body.style.overflow = 'hidden';
    }
  }

  private detachFromBody(): void {
    if (this.portalOutlet?.hasAttached()) {
      this.portalOutlet.detach();
      this.document.body.style.overflow = '';
    }
  }

  protected handleClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.detachFromBody();
      this.portalOutlet?.dispose();
      this.portalOutlet = null;
      this.document.body.style.overflow = '';
    }
  }
}
