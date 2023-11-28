import React from "react";
import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);

export default function App() {
    return (
        <div>
            <lr-config
                ctx-name="my-uploader"
                pubkey="demopublickey"
            ></lr-config>
            <lr-file-uploader-minimal
                css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.30.0/web/lr-file-uploader-minimal.min.css"
                ctx-name="my-uploader"
            ></lr-file-uploader-minimal>
        </div>
    );
}
