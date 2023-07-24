import { Component } from '@angular/core';
import * as LR from '@uploadcare/blocks';
import type { UploadcareFile } from '@uploadcare/upload-client';
import { PACKAGE_VERSION } from '@uploadcare/blocks';

LR.registerBlocks(LR);

// TODO: this type should be exported from @uploadcare/blocks
type UploadcareBlocksFile = UploadcareFile & {
  cdnUrlModifiers: string | null;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  files: UploadcareBlocksFile[] = [];
  cssSrc = `https://unpkg.com/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`

  handleUploaderEvent(e: Event) {
    const { data: files } = (e as CustomEvent).detail;
    this.files = files;
  }
}
