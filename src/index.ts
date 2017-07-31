import * as file2html from 'file2html';
import {decode} from 'file2html/lib/text-encoding';
import * as mime from 'file2html/lib/mime';
import parseDocumentContent from './parse-document-content';

const tabSeparatedFileMimeTypes: string[] = [
    mime.lookup('.tsv'),
    mime.lookup('.tab')
];
const supportedMimeTypes: string[] = tabSeparatedFileMimeTypes.concat([
    mime.lookup('.csv')
]);

export default class DSVReader extends file2html.Reader {
    read ({fileInfo}: file2html.ReaderParams) {
        const {content} = fileInfo;
        const {byteLength} = content;
        const meta: file2html.FileMetaInformation = Object.assign({
            fileType: file2html.FileTypes.document,
            mimeType: '',
            name: '',
            size: byteLength,
            creator: '',
            createdAt: '',
            modifiedAt: ''
        }, fileInfo.meta);

        return Promise.resolve(new file2html.File({
            meta,

            // reset default browser styles
            styles: '<style></style>',
            content: parseDocumentContent(decode(content), {
                isTSV: tabSeparatedFileMimeTypes.indexOf(meta.mimeType) >= 0
            })
        }));
    }

    static testFileMimeType (mimeType: string) {
        return supportedMimeTypes.indexOf(mimeType) >= 0;
    }
}