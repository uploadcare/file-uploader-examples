import { type OutputFileEntry } from '@uploadcare/file-uploader';

type MocksType = {
  title: string;
  text: string;
  photos: OutputFileEntry<'success'>[];
};

const mocks: MocksType = {
  title: 'A Romantic Weekend Getaway in Paris',
  text:
    'Paris, often referred to as the "City of Love," is a dream destination for many travellers. ' +
    'In this post we share photos from our weekend trip — the Eiffel Tower at dusk, croissants ' +
    'at the corner café, and the view from Montmartre.',
  photos: [],
};

export default mocks;
