import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);

function App() {
  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey="f7f8d4e0f5616dba10ef"
      ></lr-config>
      <lr-file-uploader-minimal
        css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.30.0/web/lr-file-uploader-minimal.min.css"
        ctx-name="my-uploader"
      ></lr-file-uploader-minimal>
    </div>
  );
}

export default App;
