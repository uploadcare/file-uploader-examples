import { UploaderBlock, ActivityBlock } from "@uploadcare/file-uploader";
import Splide from "@splidejs/splide";

const getRandomImages = async (token) => {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${token}&orientation=landscape&count=5`
  );
  const results = await response.json();
  const images = results.map((result) => ({
    id: result.id,
    rawUrl: result.urls.full,
    url: result.urls.regular,
  }));

  return images;
};

export class UnsplashSource extends UploaderBlock {
  activityType = "unsplash";
  _currentItemId = null;

  init$ = {
    handleNext: () => {
      this.next();
    },
    handlePick: () => {
      this.pick();
    },
  };

  async fetch() {
    const items = await getRandomImages(this.$.token);
    this._items.push(...items);
    for (const item of items) {
      this._splide.add(/* HTML */ `<li
        data-id="${item.id}"
        class="splide__slide"
      >
        <img src="${item.url}" />
      </li>`);
    }
  }

  mount() {
    this.unmount();
    const slider = this.ref.slider;
    this._items = [];
    this._splide = new Splide(slider).mount();

    this._splide.options = {
      arrows: false,
    };

    this._splide.on("move", () => {
      this._items.shift();
    });

    this._splide.on("active", ({ slide }) => {
      const itemId = slide.dataset.id;
      this._currentItemId = itemId;
    });
  }

  unmount() {
    this._splide?.destroy();
  }

  next() {
    if (this._items.length < 3) {
      this.fetch();
    }
    this._splide.go(">");
  }

  pick() {
    const item = this._items.find((item) => item.id === this._currentItemId);

    this.uploadCollection.add({
      externalUrl: item.rawUrl,
    });
    this.$["*currentActivity"] = ActivityBlock.activities.UPLOAD_LIST;
  }

  initCallback() {
    super.initCallback();

    this.registerActivity(this.activityType, {
      onActivate: () => {
        this.fetch();
        this.mount();
      },
      onDeactivate: () => {
        this.unmount();
      },
    });
  }

  static template = /* HTML */ `
    <svg width="0" height="0" style="position:absolute">
      <symbol
        viewBox="0 0 24 24"
        id="uc-icon-unsplash"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M15 4.5H9v4h6v-4ZM4 10.5h5v4h6v-4h5v9H4v-9Z"
        />
      </symbol>
    </svg>
    <uc-activity-header>
      <button
        type="button"
        class="uc-mini-btn uc-close-btn"
        set="onclick: *historyBack"
      >
        <uc-icon name="back"></uc-icon>
      </button>
      <div>
        <uc-icon name="unsplash"></uc-icon>
        <span>Unsplash</span>
      </div>
      <button
        type="button"
        class="uc-mini-btn uc-close-btn"
        set="onclick: *historyBack"
      >
        <uc-icon name="close"></uc-icon>
      </button>
    </uc-activity-header>
    <div class="uc-content">
      <div ref="slider" class="splide">
        <div class="splide__track">
          <ul class="splide__list"></ul>
        </div>
      </div>
    </div>
    <div class="uc-toolbar">
      <button
        type="button"
        class="uc-done-btn uc-primary-btn w-30"
        set="onclick: handlePick"
      >
        Pick
      </button>
      <button
        type="button"
        class="uc-cancel-btn uc-secondary-btn"
        set="onclick: handleNext"
      >
        Next →
      </button>
    </div>
  `;
}

UnsplashSource.bindAttributes({
  token: "token",
});
