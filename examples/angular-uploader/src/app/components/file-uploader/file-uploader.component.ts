import {
  ApplicationRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  type ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  inject,
  Output,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import type { OutputFileEntry } from '@uploadcare/file-uploader';
import * as UC from '@uploadcare/file-uploader';
import { environment } from '../../../environments/environment';
import { createUnsplashPlugin } from '../unsplash/unsplash-plugin';

UC.defineComponents(UC);

@Component({
  selector: 'file-uploader',
  imports: [],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) theme!: 'light' | 'dark';
  @Input() uploaderClassName: string | undefined;
  @Input() uploaderCtxName: string = 'my-uploader';
  @Input() files: OutputFileEntry<'success'>[] = [];
  @Output() filesChange = new EventEmitter<OutputFileEntry<'success'>[]>();

  uploadedFiles: OutputFileEntry<'success'>[] = [];
  errors: { name: string; message: string }[] = [];
  @ViewChild('ctxProvider', { static: true })
  ctxProviderRef!: ElementRef<UC.UploadCtxProvider>;

  @ViewChild('config', { static: true }) configRef!: ElementRef<
    UC.Config & { plugins?: UC.UploaderPlugin[] }
  >;

  protected unsplashAccessKey = environment.unsplashAccessKey;

  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  ngOnInit() {
    // Register custom Unsplash source plugin.
    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    this.configRef.nativeElement.plugins = [createUnsplashPlugin(this.appRef, this.injector)];

    // Demo-specific wording for "photos".
    // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
    this.configRef.nativeElement.localeDefinitionOverride = {
      en: {
        file__one: 'photo',
        file__other: 'photos',

        'upload-file': 'Upload photo',
        'upload-files': 'Upload photos',
        'choose-file': 'Choose photo',
        'choose-files': 'Choose photos',
        'drop-files-here': 'Drop photos here',
        'select-file-source': 'Select photo source',
        'edit-image': 'Edit photo',
        'no-files': 'No photos selected',
        'caption-edit-file': 'Edit photo',
        'files-count-limit-error-too-many':
          'You\u2019ve chosen too many photos. {{max}} {{plural:file(max)}} is maximum.',
        'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
        'header-uploading': 'Uploading {{count}} {{plural:file(count)}}',
        'header-succeed': '{{count}} {{plural:file(count)}} uploaded',
        'header-total': '{{count}} {{plural:file(count)}} selected',
      } as Record<string, string>,
    };
  }

  ngOnDestroy() {
    this.configRef.nativeElement.localeDefinitionOverride = null;
  }

  resetUploaderState() {
    const api = this.ctxProviderRef.nativeElement.getAPI();
    api.setCurrentActivity(null);
    api.setModalState(false);
    api.removeAllFiles();
  }

  handleRemoveClick(uuid: OutputFileEntry['uuid']) {
    this.filesChange.emit(this.files.filter((f) => f.uuid !== uuid));
  }

  handleChangeEvent = (e: UC.EventMap['change']) => {
    // Keep only successfully uploaded entries (committed on `modal-close`),
    // and surface any failed entries as user-facing errors.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    this.uploadedFiles = e.detail.allEntries.filter(
      (f) => f.status === 'success',
    ) as OutputFileEntry<'success'>[];
    this.errors = e.detail.allEntries
      .filter((f) => f.status === 'failed')
      .map((f) => ({
        name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
        message: f.errors?.[0]?.message ?? 'Upload failed',
      }));
  };

  handleModalCloseEvent = (e: UC.EventMap['modal-close']) => {
    // A nested modal (e.g. the image editor) closing also fires this
    // event — bail out so we only commit when the whole flow ends.
    if (e.detail.hasActiveModals) return;

    const justUploaded = this.uploadedFiles;
    if (!justUploaded.length) {
      return;
    }

    this.uploadedFiles = [];
    this.filesChange.emit([...this.files, ...justUploaded]);
    this.resetUploaderState();
  };
}
