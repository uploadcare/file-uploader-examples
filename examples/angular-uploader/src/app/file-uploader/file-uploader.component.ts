import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import * as LR from '@uploadcare/blocks';
import { OutputFileEntry } from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

import cssOverrides from './file-uploader.overrides.css?raw';

/*
  Note: File Uploader styles are scoped due to ShadowDOM usage.
  There are two ways to override them. One way is used on the line below,
  another one is to set a custom class to File Uploader,
  and use CSS variables to update styles.

  See more: https://uploadcare.com/docs/file-uploader/styling/
 */
LR.FileUploaderRegular.shadowStyles = cssOverrides;

LR.registerBlocks(LR);

@Component({
  selector: 'file-uploader',
  standalone: true,
  imports: [],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploaderComponent {
  @Input({ required: true }) theme!: 'light' | 'dark';
  @Input() uploaderClassName: string | undefined;
  @Input() files: OutputFileEntry[] = [];
  @Output() filesChange = new EventEmitter<OutputFileEntry[]>();

  uploadedFiles: OutputFileEntry[] = [];
  @ViewChild('ctxProvider') ctxProviderRef!: ElementRef<typeof LR.UploadCtxProvider.prototype>;

  blocksStyles = blocksStyles;

  /*
    Note: Here we use provider's API to reset File Uploader state.
    It's not necessary though. We use it here to show users
    a fresh version of File Uploader every time they open it.

    Another way is to sync File Uploader state with an external store.
    You can manipulate File Uploader using API calls like `addFileFromObject`, etc.

    See more: https://uploadcare.com/docs/file-uploader/api/
   */
  resetUploaderState() {
    this.ctxProviderRef.nativeElement.uploadCollection.clearAll();
  }

  handleRemoveClick(uuid: OutputFileEntry['uuid']) {
    this.filesChange.emit(this.files.filter(f => f.uuid !== uuid));
  }

  @HostListener('window:LR_DATA_OUTPUT', ['$event'])
  handleUploadEvent(e: CustomEvent<{ data: OutputFileEntry[] }>) {
    if (e.detail?.data) {
      this.uploadedFiles = e.detail.data;
    }
  }

  @HostListener('window:LR_DONE_FLOW', ['$event'])
  handleDoneFlow() {
    this.resetUploaderState();

    this.filesChange.emit([...this.files, ...this.uploadedFiles]);
    this.uploadedFiles = [];
  }
}
