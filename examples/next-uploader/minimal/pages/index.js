import * as LR from '@uploadcare/blocks';

import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-minimal.min.css';

LR.registerBlocks(LR);

function App() {
  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey="2b7f257e8ea0817ba746"
      ></lr-config>
      <lr-file-uploader-minimal
        css-src={blocksStyles}
        ctx-name="my-uploader"
      ></lr-file-uploader-minimal>
    </div>
  );
}

export default App;
