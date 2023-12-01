import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as LR from '@uploadcare/blocks';

import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-minimal.min.css?url';

LR.registerBlocks(LR);

@Component({
  selector: 'minimal-view',
  standalone: true,
  templateUrl: './minimal-view.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MinimalViewComponent {
  blocksStyles = blocksStyles;
}
