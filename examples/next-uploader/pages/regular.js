import * as LR from '@uploadcare/blocks';
import { PACKAGE_VERSION } from '@uploadcare/blocks';

LR.registerBlocks(LR);

function Regular() {
  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey="2b7f257e8ea0817ba746"
        sourceList="local, url, camera, dropbox"
      ></lr-config>
      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
      ></lr-file-uploader-regular>

      <p>
        <a href="/">← All Next.js Examples</a>
      </p>
    </div>
  );
}

export default Regular;
