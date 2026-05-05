import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import * as UC from '@uploadcare/file-uploader';
import { OutputFileEntry } from '@uploadcare/file-uploader';

UC.defineComponents(UC);

@Component({
  selector: 'file-uploader',
  imports: [],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FileUploaderComponent {
  @Input({ required: true }) theme!: 'light' | 'dark';
  @Input() uploaderClassName: string | undefined;
  @Input() uploaderCtxName: string = 'my-uploader';
  @Input() files: OutputFileEntry<'success'>[] = [];
  @Output() filesChange = new EventEmitter<OutputFileEntry<'success'>[]>();

  uploadedFiles: OutputFileEntry<'success'>[] = [];
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<UC.UploadCtxProvider>;

  @ViewChild('config', { static: true }) configRef!: ElementRef<UC.Config>;

  ngOnInit() {
    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/events/
     */
    this.ctxProviderRef.nativeElement.addEventListener(
      'change',
      this.handleChangeEvent
    );
    this.ctxProviderRef.nativeElement.addEventListener(
      'modal-close',
      this.handleModalCloseEvent
    );

    /*
      Note: Localization of File Uploader is done via DOM property on the config node.
      You can change any piece of text of File Uploader this way.

      See more: https://uploadcare.com/docs/file-uploader/localization/
     */
    this.configRef.nativeElement.localeDefinitionOverride = {
      en: {
        'file__one': 'photo',
        'file__other': 'photos',

        'upload-file': 'Upload photo',
        'upload-files': 'Upload photos',
        'choose-file': 'Choose photo',
        'choose-files': 'Choose photos',
        'drop-files-here': 'Drop photos here',
        'select-file-source': 'Select photo source',
        'edit-image': 'Edit photo',
        'no-files': 'No photos selected',
        'caption-edit-file': 'Edit photo',
        'files-count-limit-error-too-many': 'You\u2019ve chosen too many photos. {{max}} {{plural:file(max)}} is maximum.',
        'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
        'header-uploading': 'Uploading {{count}} {{plural:file(count)}}',
        'header-succeed': '{{count}} {{plural:file(count)}} uploaded',
        'header-total': '{{count}} {{plural:file(count)}} selected',
      }
    }
  }

  ngOnDestroy() {
    this.ctxProviderRef.nativeElement.removeEventListener('change', this.handleChangeEvent);
    this.ctxProviderRef.nativeElement.removeEventListener('modal-close', this.handleModalCloseEvent);

    this.configRef.nativeElement.localeDefinitionOverride = null;
  }

  /*
    Note: Here we use provider's API to reset File Uploader state.
    It's not necessary though. We use it here to show users
    a fresh version of File Uploader every time they open it.

    Another way is to sync File Uploader state with an external store.
    You can manipulate File Uploader using API calls like `addFileFromObject`, etc.

    See more: https://uploadcare.com/docs/file-uploader/api/
   */
  resetUploaderState() {
    this.ctxProviderRef.nativeElement.getAPI().removeAllFiles();
  }

  handleRemoveClick(uuid: OutputFileEntry['uuid']) {
    this.filesChange.emit(this.files.filter((f) => f.uuid !== uuid));
  }

  handleChangeEvent = (e: UC.EventMap['change']) => {
    this.uploadedFiles = e.detail.allEntries.filter(f => f.status === 'success') as OutputFileEntry<'success'>[];
  };

  handleModalCloseEvent = (e: UC.EventMap['modal-close']) => {
    if (e.detail.hasActiveModals) {
      return;
    }

    this.resetUploaderState();

    this.filesChange.emit([...this.files, ...this.uploadedFiles]);
    this.uploadedFiles = [];
  };
}
