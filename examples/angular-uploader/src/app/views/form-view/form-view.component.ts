import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OutputFileEntry } from '@uploadcare/file-uploader';

import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';

import MOCK_DATA from './mocks';

type FormType = {
  title: string;
  text: string;
  photos: OutputFileEntry[];
};

@Component({
  selector: 'form-view',
  imports: [FileUploaderComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './form-view.component.html',
  styleUrl: './form-view.component.scss',
})
export class FormViewComponent {
  title = new FormControl<string>(MOCK_DATA.title, { nonNullable: true });
  text = new FormControl<string>(MOCK_DATA.text, { nonNullable: true });

  /*
    `photos` is a signal so updates from `<file-uploader>`'s `filesChange`
    output trigger change detection automatically under
    `provideZonelessChangeDetection`. The plain field assignment that the
    template binding `[(files)]="photos"` would do does not.
   */
  photos = signal<OutputFileEntry<'success'>[]>(MOCK_DATA.photos);

  sentFormObject = signal<FormType | null>(null);

  theme = signal<'light' | 'dark'>(
    document.body.classList.contains('theme--dark') ? 'dark' : 'light',
  );

  handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();

    this.sentFormObject.set({
      title: this.title.value,
      text: this.text.value,
      photos: this.photos(),
    });
  }

  handleThemeChange(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return;

    this.theme.set(e.target.checked ? 'light' : 'dark');

    this.updateDocumentTheme();
  }

  updateDocumentTheme() {
    document.body.classList.remove('theme--light');
    document.body.classList.remove('theme--dark');
    document.body.classList.add(`theme--${this.theme()}`);
  }
}
