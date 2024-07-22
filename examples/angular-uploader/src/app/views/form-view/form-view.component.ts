import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OutputFileEntry } from '@uploadcare/file-uploader';

import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';

import MOCK_DATA from './mocks';

type FormType = {
  title: string;
  text: string;
  photos: OutputFileEntry[];
}

@Component({
  selector: 'form-view',
  standalone: true,
  imports: [
    FileUploaderComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './form-view.component.html',
  styleUrl: './form-view.component.scss'
})
export class FormViewComponent {
  title = new FormControl<string>(MOCK_DATA.title, { nonNullable: true });
  text = new FormControl<string>(MOCK_DATA.text, { nonNullable: true });
  photos = MOCK_DATA.photos;

  sentFormObject: FormType | null = null;

  theme: 'light' | 'dark' = document.body.classList.contains('theme--dark') ? 'dark' : 'light';

  handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();

    this.sentFormObject = {
      title: this.title.value,
      text: this.text.value,
      photos: this.photos,
    };
  }

  handleThemeChange(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return;

    this.theme = e.target.checked ? 'light' : 'dark';

    this.updateDocumentTheme();
  }

  updateDocumentTheme() {
    document.body.classList.remove('theme--light');
    document.body.classList.remove('theme--dark');
    document.body.classList.add(`theme--${this.theme}`);
  }
}
