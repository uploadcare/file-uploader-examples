import { Component, ViewEncapsulation } from '@angular/core';

// TODO: remove @ts-expect-error when we'll release the types
// @ts-expect-error
import * as UC from '@uploadcare/uc-blocks';

UC.registerBlocks(UC);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent {
  // TODO: fix any, use proper type when it will be exported
  files: any[] = [];

  handleUploaderEvent(e: Event) {
    const { data: files } = (e as CustomEvent).detail;
    this.files = files;
  }
}
