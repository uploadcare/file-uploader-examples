import { SourceBtn } from "@uploadcare/file-uploader";

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
