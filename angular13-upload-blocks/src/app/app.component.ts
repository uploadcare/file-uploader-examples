import { Component } from '@angular/core';
import '../upload-blocks/upload-blocks.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  files: any[] = [];

  handleUploaderEvent(e: any) {
    const { data: files } = e.detail;
    this.files = files;
  }
}
