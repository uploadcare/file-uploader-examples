import { SourceBtn } from "@uploadcare/blocks";

export class CustomSourceBtn extends SourceBtn {
  initTypes() {
    super.initTypes();

    this.registerType({
      type: "unsplash",
      activity: "unsplash",
      icon: "unsplash",
    });
  }
}
