/*
  Custom Unsplash source plugin.

  Registers a source button, an icon, an l10n key, a `unsplashAccessKey`
  config option, and an activity. The activity renders a vanilla DOM gallery
  inside the host element provided by the uploader.

  See https://uploadcare.com/docs/file-uploader/plugins/example/ for the
  underlying plugin API.
 */

const ENDPOINT = 'https://api.unsplash.com';

async function searchUnsplash(query, accessKey, signal) {
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

const UNSPLASH_ICON_SVG = /* HTML */ `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M15 4.5H9v4h6v-4ZM4 10.5h5v4h6v-4h5v9H4v-9Z"
    />
  </svg>
`;

export const unsplashPlugin = {
  id: 'unsplash',
  setup({ pluginApi, uploaderApi }) {
    pluginApi.registry.registerConfig({
      name: 'unsplashAccessKey',
      defaultValue: '',
    });

    pluginApi.registry.registerIcon({
      name: 'unsplash',
      svg: UNSPLASH_ICON_SVG,
    });

    pluginApi.registry.registerL10n({
      en: { 'src-type-unsplash': 'Unsplash' },
    });

    pluginApi.registry.registerSource({
      id: 'unsplash',
      label: 'src-type-unsplash',
      icon: 'unsplash',
      onSelect: () => {
        uploaderApi.setCurrentActivity('unsplash');
        uploaderApi.setModalState(true);
      },
    });

    pluginApi.registry.registerActivity({
      id: 'unsplash',
      render(host) {
        return mountUnsplashActivity(host, pluginApi, uploaderApi);
      },
    });
  },
};

function mountUnsplashActivity(host, pluginApi, uploaderApi) {
  host.innerHTML = /* HTML */ `
    <div class="uc-ui-activity-header">
      <button type="button" class="uc-ui-icon-btn" data-action="back" title="Back" aria-label="Back">
        <uc-icon name="back"></uc-icon>
      </button>
      <div>
        <uc-icon name="unsplash"></uc-icon>
        <span>Unsplash</span>
      </div>
      <button type="button" class="uc-ui-icon-btn" data-action="close" title="Close" aria-label="Close">
        <uc-icon name="close"></uc-icon>
      </button>
    </div>
    <div class="unsplash-body">
      <form class="uc-ui-toolbar unsplash-search" data-role="search">
        <input type="search" name="query" placeholder="Search Unsplash" autocomplete="off" />
        <button type="submit" class="uc-ui-primary-btn">Search</button>
      </form>
      <div class="unsplash-status" data-role="status"></div>
      <div class="unsplash-grid" data-role="grid"></div>
    </div>
  `;

  const backBtn = host.querySelector('[data-action="back"]');
  const closeBtn = host.querySelector('[data-action="close"]');
  const form = host.querySelector('[data-role="search"]');
  const input = form.querySelector('input[name="query"]');
  const status = host.querySelector('[data-role="status"]');
  const grid = host.querySelector('[data-role="grid"]');

  let abortController = null;

  const handleBack = () => uploaderApi.historyBack();
  const handleClose = () => uploaderApi.setModalState(false);

  backBtn.addEventListener('click', handleBack);
  closeBtn.addEventListener('click', handleClose);

  const renderItems = (items) => {
    grid.replaceChildren();
    for (const item of items) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'unsplash-item';
      button.title = `${item.description} — by ${item.author}`;

      // Build the card with DOM APIs rather than innerHTML so the
      // remote `description`/`author`/`thumbUrl` values can never break
      // out of the attribute or inject HTML (DOM XSS).
      const img = document.createElement('img');
      img.src = item.thumbUrl;
      img.alt = item.description;
      img.width = item.width;
      img.height = item.height;
      img.loading = 'lazy';

      const author = document.createElement('span');
      author.className = 'unsplash-author';
      author.textContent = item.author;

      button.append(img, author);
      button.addEventListener('click', () => {
        uploaderApi.addFileFromUrl(item.fullUrl, {
          fileName: `unsplash-${item.id}.jpg`,
          source: 'unsplash',
        });
        uploaderApi.setCurrentActivity('upload-list');
        uploaderApi.setModalState(true);
      });
      grid.appendChild(button);
    }
  };

  const load = async (query = '') => {
    abortController?.abort();
    abortController = new AbortController();

    status.textContent = 'Loading…';
    grid.replaceChildren();

    try {
      const accessKey = pluginApi.config.get('unsplashAccessKey');
      const items = await searchUnsplash(query, accessKey, abortController.signal);
      status.textContent = items.length === 0 ? 'No results' : '';
      renderItems(items);
    } catch (err) {
      if (err.name === 'AbortError') return;
      status.textContent = err.message;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    load(input.value.trim());
  };

  form.addEventListener('submit', handleSubmit);

  load();

  return () => {
    abortController?.abort();
    backBtn.removeEventListener('click', handleBack);
    closeBtn.removeEventListener('click', handleClose);
    form.removeEventListener('submit', handleSubmit);
    host.replaceChildren();
  };
}
