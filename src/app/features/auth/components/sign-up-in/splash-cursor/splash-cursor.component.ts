import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createSplashCursor } from './splash-cursor.engine';

@Component({
  selector: 'app-splash-cursor',
  standalone: true,
  templateUrl: './splash-cursor.component.html',
  styleUrl: './splash-cursor.component.scss',
})
export default class SplashCursorComponent implements AfterViewInit, OnDestroy {
  @Input() colors = ['#6b2536', '#d68c9b', '#583441'];
  @Input() size = 1;
  @Input() force = 1;
  @Input() swirl = 3;
  @Input() trail = 1;
  @Input() clickSplash = true;

  @ViewChild('cv', { static: true }) cv!: ElementRef<HTMLCanvasElement>;
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private stop?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => {
      this.stop = createSplashCursor(this.cv.nativeElement, {
        colors: this.colors,
        size: this.size,
        force: this.force,
        swirl: this.swirl,
        trail: this.trail,
        clickSplash: this.clickSplash,
      });
    });
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}