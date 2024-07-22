import { OutputFileEntry } from '@uploadcare/file-uploader';

type MocksType = {
  title: string;
  text: string;
  photos: OutputFileEntry<'success'>[];
}

const mocks: MocksType = {
  title: 'A Romantic Weekend Getaway in Paris',
  text: `Paris, often referred to as the "City of Love" and the "City of Lights," is a dream destination for many travelers around the world. With its rich history, stunning architecture, delectable cuisine, and an unmistakable romantic atmosphere, Paris offers an unforgettable experience. In this blog post, we'll take you on a journey through our recent weekend trip to Paris, where we gazed at the iconic Eiffel Tower, indulged in heavenly croissants, and immersed ourselves in the city's captivating charm.

# Day 1: Arrival in the City of Love

...`,
  photos: [
    {
      uuid: '1be82782-2cfe-4269-8ea3-da4279a1c7f4',
      internalId: '6GYw7vtML-Z6K',
      name: 'arthur-humeau-3xwdarHxHqI-unsplash.jpg',
      size: 1657550,
      isImage: true,
      mimeType: 'image/jpeg',
      file: null,
      externalUrl: null,
      cdnUrlModifiers: '',
      cdnUrl: 'https://ucarecdn.com/1be82782-2cfe-4269-8ea3-da4279a1c7f4/',
      fullPath: '/arthur-humeau-3xwdarHxHqI-unsplash.jpg',
      uploadProgress: 100,
      fileInfo: {
        uuid: '1be82782-2cfe-4269-8ea3-da4279a1c7f4',
        name: 'arthurhumeau3xwdarHxHqIunsplash.jpg',
        size: 1657550,
        isStored: true,
        isImage: true,
        mimeType: 'image/jpeg',
        cdnUrl: 'https://ucarecdn.com/1be82782-2cfe-4269-8ea3-da4279a1c7f4/',
        s3Url: null,
        originalFilename: 'arthur-humeau-3xwdarHxHqI-unsplash.jpg',
        imageInfo: {
          dpi: [
            72,
            72
          ],
          width: 2400,
          format: 'JPEG',
          height: 3600,
          sequence: false,
          colorMode: 'RGB',
          orientation: null,
          geoLocation: null,
          datetimeOriginal: null
        },
        videoInfo: null,
        contentInfo: {
          mime: {
            mime: 'image/jpeg',
            type: 'image',
            subtype: 'jpeg'
          },
          image: {
            dpi: [
              72,
              72
            ],
            width: 2400,
            format: 'JPEG',
            height: 3600,
            sequence: false,
            colorMode: 'RGB',
            orientation: null,
            geoLocation: null,
            datetimeOriginal: null
          }
        },
        metadata: {},
        s3Bucket: null,
        defaultEffects: null
      },
      metadata: {},
      isSuccess: true,
      isUploading: false,
      isFailed: false,
      isRemoved: false,
      errors: [],
      status: 'success'
    },
    {
      uuid: '57a9505d-1118-4f0b-8417-0efa780e35f6',
      internalId: 'qOqnI0Svy-nMY',
      name: 'bharat-patil-WR5_Ev_bh-I-unsplash.jpg',
      size: 974188,
      isImage: true,
      mimeType: 'image/jpeg',
      file: null,
      externalUrl: null,
      cdnUrlModifiers: '',
      cdnUrl: 'https://ucarecdn.com/57a9505d-1118-4f0b-8417-0efa780e35f6/',
      fullPath: '/bharat-patil-WR5_Ev_bh-I-unsplash.jpg',
      uploadProgress: 100,
      fileInfo: {
        uuid: '57a9505d-1118-4f0b-8417-0efa780e35f6',
        name: 'bharatpatilWR5_Ev_bhIunsplash.jpg',
        size: 974188,
        isStored: true,
        isImage: true,
        mimeType: 'image/jpeg',
        cdnUrl: 'https://ucarecdn.com/57a9505d-1118-4f0b-8417-0efa780e35f6/',
        s3Url: null,
        originalFilename: 'bharat-patil-WR5_Ev_bh-I-unsplash.jpg',
        imageInfo: {
          dpi: [
            72,
            72
          ],
          width: 2400,
          format: 'JPEG',
          height: 1600,
          sequence: false,
          colorMode: 'RGB',
          orientation: null,
          geoLocation: null,
          datetimeOriginal: null
        },
        videoInfo: null,
        contentInfo: {
          mime: {
            mime: 'image/jpeg',
            type: 'image',
            subtype: 'jpeg'
          },
          image: {
            dpi: [
              72,
              72
            ],
            width: 2400,
            format: 'JPEG',
            height: 1600,
            sequence: false,
            colorMode: 'RGB',
            orientation: null,
            geoLocation: null,
            datetimeOriginal: null
          }
        },
        metadata: {},
        s3Bucket: null,
        defaultEffects: null
      },
      metadata: {},
      isSuccess: true,
      isUploading: false,
      isFailed: false,
      isRemoved: false,
      errors: [],
      status: 'success'
    },
    {
      uuid: '040b5f13-ff2c-4d06-995a-3f8e3ece1ae7',
      internalId: '38Mr9577M-2JE',
      name: 'chris-karidis-nnzkZNYWHaU-unsplash.jpg',
      size: 535450,
      isImage: true,
      mimeType: 'image/jpeg',
      file: null,
      externalUrl: null,
      cdnUrlModifiers: '',
      cdnUrl: 'https://ucarecdn.com/040b5f13-ff2c-4d06-995a-3f8e3ece1ae7/',
      fullPath: '/chris-karidis-nnzkZNYWHaU-unsplash.jpg',
      uploadProgress: 100,
      fileInfo: {
        uuid: '040b5f13-ff2c-4d06-995a-3f8e3ece1ae7',
        name: 'chriskaridisnnzkZNYWHaUunsplash.jpg',
        size: 535450,
        isStored: true,
        isImage: true,
        mimeType: 'image/jpeg',
        cdnUrl: 'https://ucarecdn.com/040b5f13-ff2c-4d06-995a-3f8e3ece1ae7/',
        s3Url: null,
        originalFilename: 'chris-karidis-nnzkZNYWHaU-unsplash.jpg',
        imageInfo: {
          dpi: [
            72,
            72
          ],
          width: 2400,
          format: 'JPEG',
          height: 1596,
          sequence: false,
          colorMode: 'RGB',
          orientation: null,
          geoLocation: null,
          datetimeOriginal: null
        },
        videoInfo: null,
        contentInfo: {
          mime: {
            mime: 'image/jpeg',
            type: 'image',
            subtype: 'jpeg'
          },
          image: {
            dpi: [
              72,
              72
            ],
            width: 2400,
            format: 'JPEG',
            height: 1596,
            sequence: false,
            colorMode: 'RGB',
            orientation: null,
            geoLocation: null,
            datetimeOriginal: null
          }
        },
        metadata: {},
        s3Bucket: null,
        defaultEffects: null
      },
      metadata: {},
      isSuccess: true,
      isUploading: false,
      isFailed: false,
      isRemoved: false,
      errors: [],
      status: 'success'
    },
    {
      uuid: '8fbd0e17-51ff-4804-a4cf-09c228a8526a',
      internalId: 'NxiT0MrhJ-oXS',
      name: 'earth-DXuxHw3S5ak-unsplash.jpg',
      size: 673331,
      isImage: true,
      mimeType: 'image/jpeg',
      file: null,
      externalUrl: null,
      cdnUrlModifiers: '',
      cdnUrl: 'https://ucarecdn.com/8fbd0e17-51ff-4804-a4cf-09c228a8526a/',
      fullPath: '/earth-DXuxHw3S5ak-unsplash.jpg',
      uploadProgress: 100,
      fileInfo: {
        uuid: '8fbd0e17-51ff-4804-a4cf-09c228a8526a',
        name: 'earthDXuxHw3S5akunsplash.jpg',
        size: 673331,
        isStored: true,
        isImage: true,
        mimeType: 'image/jpeg',
        cdnUrl: 'https://ucarecdn.com/8fbd0e17-51ff-4804-a4cf-09c228a8526a/',
        s3Url: null,
        originalFilename: 'earth-DXuxHw3S5ak-unsplash.jpg',
        imageInfo: {
          dpi: [
            72,
            72
          ],
          width: 1600,
          format: 'JPEG',
          height: 2000,
          sequence: false,
          colorMode: 'RGB',
          orientation: null,
          geoLocation: null,
          datetimeOriginal: null
        },
        videoInfo: null,
        contentInfo: {
          mime: {
            mime: 'image/jpeg',
            type: 'image',
            subtype: 'jpeg'
          },
          image: {
            dpi: [
              72,
              72
            ],
            width: 1600,
            format: 'JPEG',
            height: 2000,
            sequence: false,
            colorMode: 'RGB',
            orientation: null,
            geoLocation: null,
            datetimeOriginal: null
          }
        },
        metadata: {},
        s3Bucket: null,
        defaultEffects: null
      },
      metadata: {},
      isSuccess: true,
      isUploading: false,
      isFailed: false,
      isRemoved: false,
      errors: [],
      status: 'success'
    },
    {
      uuid: 'b127ad22-c76b-4712-9f7a-c76561b61610',
      internalId: 'uWUiPJQTo-YlY',
      name: 'john-towner-Hf4Ap1-ef40-unsplash.jpg',
      size: 1868140,
      isImage: true,
      mimeType: 'image/jpeg',
      file: null,
      externalUrl: null,
      cdnUrlModifiers: '',
      cdnUrl: 'https://ucarecdn.com/b127ad22-c76b-4712-9f7a-c76561b61610/',
      fullPath: '/john-towner-Hf4Ap1-ef40-unsplash.jpg',
      uploadProgress: 100,
      fileInfo: {
        uuid: 'b127ad22-c76b-4712-9f7a-c76561b61610',
        name: 'johntownerHf4Ap1ef40unsplash.jpg',
        size: 1868140,
        isStored: true,
        isImage: true,
        mimeType: 'image/jpeg',
        cdnUrl: 'https://ucarecdn.com/b127ad22-c76b-4712-9f7a-c76561b61610/',
        s3Url: null,
        originalFilename: 'john-towner-Hf4Ap1-ef40-unsplash.jpg',
        imageInfo: {
          dpi: [
            72,
            72
          ],
          width: 2400,
          format: 'JPEG',
          height: 3438,
          sequence: false,
          colorMode: 'RGB',
          orientation: null,
          geoLocation: null,
          datetimeOriginal: null
        },
        videoInfo: null,
        contentInfo: {
          mime: {
            mime: 'image/jpeg',
            type: 'image',
            subtype: 'jpeg'
          },
          image: {
            dpi: [
              72,
              72
            ],
            width: 2400,
            format: 'JPEG',
            height: 3438,
            sequence: false,
            colorMode: 'RGB',
            orientation: null,
            geoLocation: null,
            datetimeOriginal: null
          }
        },
        metadata: {},
        s3Bucket: null,
        defaultEffects: null
      },
      metadata: {},
      isSuccess: true,
      isUploading: false,
      isFailed: false,
      isRemoved: false,
      errors: [],
      status: 'success'
    },
    {
      uuid: '0b1cf64b-ffba-4866-bd1a-4f7c0c6b71d8',
      internalId: 'Hb2KdscDC-69e',
      name: 'sebastien-gabriel-gyUVNafCIG8-unsplash.jpg',
      size: 1021096,
      isImage: true,
      mimeType: 'image/jpeg',
      file: null,
      externalUrl: null,
      cdnUrlModifiers: '',
      cdnUrl: 'https://ucarecdn.com/0b1cf64b-ffba-4866-bd1a-4f7c0c6b71d8/',
      fullPath: '/sebastien-gabriel-gyUVNafCIG8-unsplash.jpg',
      uploadProgress: 100,
      fileInfo: {
        uuid: '0b1cf64b-ffba-4866-bd1a-4f7c0c6b71d8',
        name: 'sebastiengabrielgyUVNafCIG8unsplash.jpg',
        size: 1021096,
        isStored: true,
        isImage: true,
        mimeType: 'image/jpeg',
        cdnUrl: 'https://ucarecdn.com/0b1cf64b-ffba-4866-bd1a-4f7c0c6b71d8/',
        s3Url: null,
        originalFilename: 'sebastien-gabriel-gyUVNafCIG8-unsplash.jpg',
        imageInfo: {
          dpi: [
            72,
            72
          ],
          width: 2400,
          format: 'JPEG',
          height: 3600,
          sequence: false,
          colorMode: 'RGB',
          orientation: null,
          geoLocation: null,
          datetimeOriginal: null
        },
        videoInfo: null,
        contentInfo: {
          mime: {
            mime: 'image/jpeg',
            type: 'image',
            subtype: 'jpeg'
          },
          image: {
            dpi: [
              72,
              72
            ],
            width: 2400,
            format: 'JPEG',
            height: 3600,
            sequence: false,
            colorMode: 'RGB',
            orientation: null,
            geoLocation: null,
            datetimeOriginal: null
          }
        },
        metadata: {},
        s3Bucket: null,
        defaultEffects: null
      },
      metadata: {},
      isSuccess: true,
      isUploading: false,
      isFailed: false,
      isRemoved: false,
      errors: [],
      status: 'success'
    }
  ]
}

export default mocks;
