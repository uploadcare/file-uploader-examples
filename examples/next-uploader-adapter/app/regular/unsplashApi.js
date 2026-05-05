const ENDPOINT = 'https://api.unsplash.com';

export async function searchUnsplash(query, accessKey, signal) {
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

  return items.map((item) => ({
    id: item.id,
    description: item.alt_description ?? item.description ?? 'Unsplash photo',
    thumbUrl: item.urls.small,
    fullUrl: item.urls.full,
    author: item.user?.name ?? 'Unknown',
    width: item.width,
    height: item.height,
  }));
}
