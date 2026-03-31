import { Root, createRoot } from "react-dom/client";

import * as LR from "@uploadcare/blocks";
import { MyCustomActivityComponent } from "./MyCustomActivityComponent";
import "./MyCustomActivity.css";

export class MyCustomActivity extends LR.UploaderBlock {
  // @ts-expect-error - There are some types mismatch here
  activityType = "my-custom-activity";
  _reactRoot: Root | undefined;

  initCallback() {
    super.initCallback();
    this.registerActivity(this.activityType, {
      onActivate: () => {
        const reactRootEl = this.ref["react-root"];
        const root = createRoot(reactRootEl);
        root.render(<MyCustomActivityComponent api={this} />);

        this._reactRoot = root;
      },
      onDeactivate: () => {
        this._reactRoot?.unmount();
        this._reactRoot = undefined;
      },
    });
  }
}
MyCustomActivity.template = /* HTML */ `
  <lr-activity-header>
    <button type="button" class="mini-btn" set="onclick: *historyBack">
      <lr-icon name="back"></lr-icon>
    </button>
    <button
      type="button"
      class="mini-btn close-btn"
      set="onclick: *historyBack"
    >
      <lr-icon name="close"></lr-icon>
    </button>
  </lr-activity-header>
  <div class="content">
    <div ref="react-root"></div>
  </div>
`;
