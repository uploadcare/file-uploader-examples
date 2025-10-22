import * as UC from "@uploadcare/file-uploader";
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css'
UC.defineComponents(UC);

export default {
  title: "Example/Demo",
  tags: ["autodocs"],
  render: () => {
    return (
      <div>
        <uc-file-uploader-regular ctx-name="my-uploader"></uc-file-uploader-regular>
        <uc-config
          ctx-name="my-uploader"
          pubkey="demopublickey"
          debug
        ></uc-config>
        <uc-upload-ctx-provider ctx-name="my-uploader"></uc-upload-ctx-provider>
      </div>
    );
  },
};

export const Primary = {};
