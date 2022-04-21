import { Component, ViewEncapsulation } from '@angular/core';
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
  files: any[] = [];

  handleUploaderEvent(e: Event) {
    const { data: files } = (e as CustomEvent).detail;
    this.files = files;
  }
}
