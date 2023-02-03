import { Component, ViewEncapsulation } from '@angular/core';
import * as LR from '@uploadcare/blocks';
import type { UploadcareFile } from '@uploadcare/upload-client';

LR.registerBlocks(LR);

// TODO: this type should be exported from @uploadcare/blocks
type UploadcareBlocksFile = UploadcareFile & {
  cdnUrlModifiers: string | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppComponent {
  files: UploadcareBlocksFile[] = [];

  handleUploaderEvent(e: Event) {
    const { data: files } = (e as CustomEvent).detail;
    this.files = files;
  }
}
