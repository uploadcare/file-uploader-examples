import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import * as LR from '@uploadcare/blocks';
import { OutputFileEntry } from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

import cssOverrides from './file-uploader.overrides.css?raw';

LR.registerBlocks(LR);

@Component({
  selector: 'file-uploader',
  standalone: true,
  imports: [],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FileUploaderComponent {
  @Input({ required: true }) theme!: 'light' | 'dark';
  @Input() uploaderClassName: string | undefined;
  @Input() files: OutputFileEntry[] = [];
  @Output() filesChange = new EventEmitter<OutputFileEntry[]>();

  uploadedFiles: OutputFileEntry[] = [];
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<LR.UploadCtxProvider>
  >;

  blocksStyles = blocksStyles;

  ngOnInit() {
    /*
    Note: File Uploader styles are scoped due to ShadowDOM usage.
    There are two ways to override them. One way is used on the line below,
    another one is to set a custom class to File Uploader,
    and use CSS variables to update styles.

    See more: https://uploadcare.com/docs/file-uploader/styling/
   */
    LR.FileUploaderRegular.shadowStyles = cssOverrides;

    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/data-and-events/#events
     */
    this.ctxProviderRef.nativeElement.addEventListener(
      'data-output',
      this.handleUploadEvent
    );
    this.ctxProviderRef.nativeElement.addEventListener(
      'done-flow',
      this.handleDoneFlow
    );
  }

  ngOnDestroy() {
    /*
      Note: We're resetting styles here just to be sure they do not affect other examples.
      You probably do not need to do it in your app.
     */
    LR.FileUploaderRegular.shadowStyles = '';

    this.ctxProviderRef.nativeElement.removeEventListener('data-output', this.handleUploadEvent);
    this.ctxProviderRef.nativeElement.removeEventListener('done-flow', this.handleDoneFlow);
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
    this.ctxProviderRef.nativeElement.uploadCollection.clearAll();
  }

  handleRemoveClick(uuid: OutputFileEntry['uuid']) {
    this.filesChange.emit(this.files.filter((f) => f.uuid !== uuid));
  }

  handleUploadEvent = (e: LR.EventMap['data-output']) => {
    this.uploadedFiles = e.detail;
  };

  handleDoneFlow = () => {
    this.resetUploaderState();

    this.filesChange.emit([...this.files, ...this.uploadedFiles]);
    this.uploadedFiles = [];
  };
}
