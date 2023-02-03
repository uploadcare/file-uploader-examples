import { UploaderBlock, ActivityBlock } from "@uploadcare/blocks";
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

  init$ = {
    handleNext: () => {
      this.next();
    },
    handlePick: () => {
      this.pick();
    },
  };

  cssInit$ = {
    "--cfg-unsplash-token": null,
  };

  get token() {
    return this.getCssData("--cfg-unsplash-token");
  }

  async fetch() {
    const items = await getRandomImages(this.token);
    this._items.push(...items);
    for (const item of items) {
      this._splide.add(
        /* HTML */ `<li class="splide__slide"><img src="${item.url}" /></li>`
      );
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
    const item = this._items[0];
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
    <lr-activity-header>
      <button
        type="button"
        class="mini-btn close-btn"
        set="onclick: *historyBack"
      >
        <lr-icon name="back"></lr-icon>
      </button>
      <div>
        <lr-icon name="unsplash"></lr-icon>
        <span>Unsplash</span>
      </div>
      <button
        type="button"
        class="mini-btn close-btn"
        set="onclick: *historyBack"
      >
        <lr-icon name="close"></lr-icon>
      </button>
    </lr-activity-header>
    <div class="content">
      <div ref="slider" class="splide">
        <div class="splide__track">
          <ul class="splide__list"></ul>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <button
        type="button"
        class="done-btn primary-btn w-30"
        set="onclick: handlePick"
      >
        Pick
      </button>
      <button
        type="button"
        class="cancel-btn secondary-btn"
        set="onclick: handleNext"
      >
        Next →
      </button>
    </div>
  `;
}
