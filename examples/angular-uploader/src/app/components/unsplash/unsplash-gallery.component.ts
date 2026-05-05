import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
  OnDestroy,
  inject,
} from '@angular/core';
import type { UploaderPublicApi } from '@uploadcare/file-uploader';

import { searchUnsplash, UnsplashItem } from './unsplash-api';

@Component({
  selector: 'unsplash-gallery',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './unsplash-gallery.component.html',
  styleUrl: './unsplash-gallery.component.scss',
})
export class UnsplashGalleryComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) uploaderApi!: UploaderPublicApi;
  @Input() accessKey = '';

  items: UnsplashItem[] = [];
  status = 'Loading…';

  private cdr = inject(ChangeDetectorRef);
  private controller: AbortController | null = null;
  private currentQuery = '';

  ngOnChanges() {
    this.load(this.currentQuery);
  }

  ngOnDestroy() {
    this.controller?.abort();
  }

  onBack() {
    this.uploaderApi.historyBack();
  }

  onClose() {
    this.uploaderApi.setModalState(false);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('query') as HTMLInputElement;
    this.currentQuery = input.value.trim();
    this.load(this.currentQuery);
  }

  onPick(item: UnsplashItem) {
    this.uploaderApi.addFileFromUrl(item.fullUrl, {
      fileName: `unsplash-${item.id}.jpg`,
      source: 'unsplash',
    });
    this.uploaderApi.setCurrentActivity('upload-list');
    this.uploaderApi.setModalState(true);
  }

  private async load(query: string) {
    this.controller?.abort();
    this.controller = new AbortController();
    this.status = 'Loading…';
    this.items = [];
    this.cdr.detectChanges();

    try {
      const results = await searchUnsplash(query, this.accessKey, this.controller.signal);
      this.items = results;
      this.status = results.length === 0 ? 'No results' : '';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      this.status = err instanceof Error ? err.message : 'Error';
    }

    this.cdr.detectChanges();
  }
}
