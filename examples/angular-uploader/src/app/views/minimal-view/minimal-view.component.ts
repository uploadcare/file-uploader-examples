import {
  ApplicationRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  OnInit,
} from '@angular/core';
import * as UC from '@uploadcare/file-uploader';
import { OutputFileEntry } from '@uploadcare/file-uploader';

import { createUnsplashPlugin } from '../../components/unsplash/unsplash-plugin';
import { environment } from '../../../environments/environment';

UC.defineComponents(UC);

@Component({
  selector: 'minimal-view',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './minimal-view.component.html',
  styleUrl: './minimal-view.component.scss',
})
export class MinimalViewComponent implements OnInit {
  @Input() files: OutputFileEntry<'success'>[] = [];
  @Output() filesChange = new EventEmitter<OutputFileEntry<'success'>[]>();

  errors: { name: string; message: string }[] = [];

  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<UC.UploadCtxProvider>;
  @ViewChild('config', { static: true }) configRef!: ElementRef<
    HTMLElement & { plugins?: UC.UploaderPlugin[] }
  >;

  protected unsplashAccessKey = environment.unsplashAccessKey;

  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  ngOnInit() {
    // Register custom Unsplash source plugin on the config element.
    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    const config = this.configRef.nativeElement;
    config.plugins = [createUnsplashPlugin(this.appRef, this.injector)];
  }

  // Listen for upload-collection updates. The `change` event delivers the
  // full collection on every transition, so we re-derive both successful
  // and failed entries on each call.
  // Events docs: https://uploadcare.com/docs/file-uploader/events/
  handleChangeEvent = (e: UC.EventMap['change']) => {
    this.files = e.detail.allEntries.filter(
      (f) => f.status === 'success',
    ) as OutputFileEntry<'success'>[];
    this.errors = e.detail.allEntries
      .filter((f) => f.status === 'failed')
      .map((f) => ({
        name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
        message: f.errors?.[0]?.message ?? 'Upload failed',
      }));
  };

  formatSize = (bytes: number | null) => {
    if (!bytes) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };
}
