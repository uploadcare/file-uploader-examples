import { Component } from '@angular/core';
import '@uploadcare/upload-blocks';

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
