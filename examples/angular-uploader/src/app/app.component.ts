import { Component, ViewEncapsulation } from '@angular/core';
import * as LR from '@uploadcare/uc-blocks';
import type { UploadcareFile } from '@uploadcare/uc-blocks/submodules/upload-client/upload-client.js';

LR.registerBlocks(LR);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppComponent {
  files: UploadcareFile[] = [];

  handleUploaderEvent(e: Event) {
    const { data: files } = (e as CustomEvent).detail;
    this.files = files;
  }
}
