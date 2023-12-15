import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as LR from '@uploadcare/blocks';

import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

LR.registerBlocks(LR);

@Component({
  selector: 'regular-view',
  standalone: true,
  templateUrl: './regular-view.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegularViewComponent {
  blocksStyles = blocksStyles;
}
