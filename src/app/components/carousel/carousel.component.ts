import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

export interface CarouselPill {
  id: string;
  label: string;
  avatar?: string;
  ariaLabel: string;
}

export interface CarouselSlide<T> {
  slideId: string;
  realIndex: number;
  item: T;
  isClone: boolean;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent<T = any> implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  // Inputs
  readonly items = input.required<T[]>();
  readonly pills = input<CarouselPill[]>([]);
  readonly ariaLabel = input<string>('');
  readonly prevAria = input<string>('Previous');
  readonly nextAria = input<string>('Next');
  readonly autoPlayMs = input<number>(0);
  readonly slideWidth = input<string>('clamp(280px, 80vw, 440px)');
  readonly slideGap = input<string>('16px');

  // Outputs
  @Output() activeIndexChange = new EventEmitter<number>();

  // Template projection for slide body
  @ContentChild(TemplateRef) slideTemplate!: TemplateRef<{
    $implicit: T;
    index: number;
    isActive: boolean;
    isPeeking: boolean;
    isClone: boolean;
    hasDragged: boolean;
  }>;

  // Icons
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;

  // State
  readonly trackIndex = signal(1);
  readonly transitionEnabled = signal(true);
  readonly isPaused = signal(false);
  readonly dragOffsetPx = signal(0);
  readonly isDragging = signal(false);

  private autoTimer?: ReturnType<typeof setInterval>;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private isHorizontalDrag = false;
  private activePointerId?: number;
  hasDragged = false;

  readonly activeRealIndex = computed(() => {
    const list = this.items();
    const count = list?.length || 1;
    const trackIdx = this.trackIndex();
    return ((trackIdx - 1) % count + count) % count;
  });

  readonly slides = computed<CarouselSlide<T>[]>(() => {
    const list = this.items();
    if (!list || list.length === 0) return [];
    const count = list.length;
    const last = list[count - 1];
    const first = list[0];

    return [
      {
        slideId: 'clone-last',
        realIndex: count - 1,
        item: last,
        isClone: true
      },
      ...list.map((it, idx) => ({
        slideId: `real-${idx}`,
        realIndex: idx,
        item: it,
        isClone: false
      })),
      {
        slideId: 'clone-first',
        realIndex: 0,
        item: first,
        isClone: true
      }
    ];
  });

  ngOnInit(): void {
    if (this.autoPlayMs() > 0) {
      this.startAutoScroll();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  next(): void {
    const count = this.items()?.length || 1;
    if (this.trackIndex() >= count + 1) return;
    this.transitionEnabled.set(true);
    this.trackIndex.update((idx) => idx + 1);
    this.emitActiveChange();
    this.resetAutoTimer();
  }

  prev(): void {
    if (this.trackIndex() <= 0) return;
    this.transitionEnabled.set(true);
    this.trackIndex.update((idx) => idx - 1);
    this.emitActiveChange();
    this.resetAutoTimer();
  }

  select(realIndex: number): void {
    this.transitionEnabled.set(true);
    this.trackIndex.set(realIndex + 1);
    this.emitActiveChange();
    this.resetAutoTimer();
  }

  private emitActiveChange(): void {
    // Wait for signal update microtask so activeRealIndex is fresh
    queueMicrotask(() => {
      this.activeIndexChange.emit(this.activeRealIndex());
    });
  }

  trackSlideById(_index: number, slide: CarouselSlide<T>): string {
    return slide.slideId;
  }

  onTrackTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== 'transform') return;
    if (!this.transitionEnabled()) return;

    const count = this.items()?.length || 1;
    const current = this.trackIndex();

    if (current >= count + 1) {
      const trackEl = event.currentTarget as HTMLElement | null;
      if (trackEl) trackEl.style.transition = 'none';
      this.transitionEnabled.set(false);
      this.trackIndex.set(1);
      this.cdr.detectChanges();
      if (trackEl) void trackEl.offsetHeight;
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (trackEl) trackEl.style.transition = '';
            this.transitionEnabled.set(true);
          });
        });
      }
    } else if (current <= 0) {
      const trackEl = event.currentTarget as HTMLElement | null;
      if (trackEl) trackEl.style.transition = 'none';
      this.transitionEnabled.set(false);
      this.trackIndex.set(count);
      this.cdr.detectChanges();
      if (trackEl) void trackEl.offsetHeight;
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (trackEl) trackEl.style.transition = '';
            this.transitionEnabled.set(true);
          });
        });
      }
    }
  }

  private startAutoScroll(): void {
    if (typeof window === 'undefined') return;
    const interval = this.autoPlayMs();
    if (interval <= 0) return;

    this.stopAutoScroll();
    this.zone.runOutsideAngular(() => {
      this.autoTimer = setInterval(() => {
        if (this.isPaused() || this.isDragging() || this.isReducedMotion()) return;
        this.zone.run(() => {
          this.next();
        });
      }, interval);
    });
  }

  private stopAutoScroll(): void {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = undefined;
    }
  }

  private resetAutoTimer(): void {
    if (this.autoPlayMs() > 0) {
      this.startAutoScroll();
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.currentTarget as HTMLElement;
    try {
      target.setPointerCapture?.(event.pointerId);
    } catch {
      // Ignore
    }
    this.activePointerId = event.pointerId;
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
    this.dragOffsetPx.set(0);
    this.isHorizontalDrag = false;
    this.hasDragged = false;
    this.isDragging.set(true);
    this.isPaused.set(true);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) return;
    if (this.activePointerId !== undefined && event.pointerId !== this.activePointerId) return;

    const deltaX = event.clientX - this.pointerStartX;
    const deltaY = event.clientY - this.pointerStartY;

    if (!this.isHorizontalDrag) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) >= Math.abs(deltaY) * 0.7) {
        this.isHorizontalDrag = true;
        this.hasDragged = true;
      } else if (Math.abs(deltaY) > 12 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
        // Vertical scroll gesture - release capture and let page scroll natively
        const target = event.currentTarget as HTMLElement;
        try {
          if (target.hasPointerCapture?.(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
        } catch {
          // Ignore
        }
        this.activePointerId = undefined;
        this.isDragging.set(false);
        this.dragOffsetPx.set(0);
        return;
      }
    }

    if (this.isHorizontalDrag) {
      this.transitionEnabled.set(false);
      this.dragOffsetPx.set(deltaX);
    }
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.isDragging()) return;
    if (this.activePointerId !== undefined && event.pointerId !== this.activePointerId) return;

    const target = event.currentTarget as HTMLElement;
    try {
      if (target.hasPointerCapture?.(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore
    }
    this.activePointerId = undefined;

    const deltaX = this.dragOffsetPx();
    this.isDragging.set(false);
    this.dragOffsetPx.set(0);
    this.transitionEnabled.set(true);
    this.isPaused.set(false);

    if (this.isHorizontalDrag) {
      if (deltaX < -35) {
        this.next();
      } else if (deltaX > 35) {
        this.prev();
      }
    }
    this.isHorizontalDrag = false;
    setTimeout(() => {
      this.hasDragged = false;
    }, 100);
  }

  onPointerCancel(event?: PointerEvent): void {
    if (event) {
      const target = event.currentTarget as HTMLElement;
      try {
        if (target.hasPointerCapture?.(event.pointerId)) {
          target.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore
      }
    }
    this.activePointerId = undefined;
    this.isDragging.set(false);
    this.dragOffsetPx.set(0);
    this.transitionEnabled.set(true);
    this.isPaused.set(false);
    this.isHorizontalDrag = false;
    setTimeout(() => {
      this.hasDragged = false;
    }, 100);
  }

  onSlideClick(sIdx: number): void {
    if (this.hasDragged) return;
    if (this.trackIndex() !== sIdx) {
      if (sIdx > this.trackIndex()) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  setPaused(paused: boolean): void {
    this.isPaused.set(paused);
  }

  private isReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
