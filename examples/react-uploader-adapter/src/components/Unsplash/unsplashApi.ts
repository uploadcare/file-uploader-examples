const ENDPOINT = 'https://api.unsplash.com';

export interface UnsplashItem {
  id: string;
  description: string;
  thumbUrl: string;
  fullUrl: string;
  author: string;
  width: number;
  height: number;
}

export async function searchUnsplash(
  query: string,
  accessKey: string,
  signal?: AbortSignal,
): Promise<UnsplashItem[]> {
  if (!accessKey) {
    throw new Error('Unsplash access key is missing.');
  }

  const url = query
    ? `${ENDPOINT}/search/photos?query=${encodeURIComponent(query)}&per_page=24`
    : `${ENDPOINT}/photos?per_page=24&order_by=popular`;

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unsplash request failed: ${response.status}`);
  }

  const json = await response.json();
  const items = query ? json.results : json;

  return items.map((item: any) => ({
    id: item.id,
    description: item.alt_description ?? item.description ?? 'Unsplash photo',
    thumbUrl: item.urls.small,
    fullUrl: item.urls.full,
    author: item.user?.name ?? 'Unknown',
    width: item.width,
    height: item.height,
  }));
}
