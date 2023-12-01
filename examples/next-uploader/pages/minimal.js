import * as LR from '@uploadcare/blocks';
import { PACKAGE_VERSION } from '@uploadcare/blocks';

LR.registerBlocks(LR);

function Minimal() {
  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey="2b7f257e8ea0817ba746"
      ></lr-config>
      <lr-file-uploader-minimal
        ctx-name="my-uploader"
        css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-minimal.min.css`}
      ></lr-file-uploader-minimal>
    </div>
  );
}

export default Minimal;
