import * as file2html from 'file2html';
import * as mime from 'file2html/lib/mime';

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

        return Promise.resolve(new file2html.File({
            meta: Object.assign({
                fileType: file2html.FileTypes.document,
                mimeType: '',
                name: '',
                size: byteLength,
                creator: '',
                createdAt: '',
                modifiedAt: ''
            }, fileInfo.meta),
            styles: '<style></style>',
            content: ''
        }));
    }

    static testFileMimeType (mimeType: string) {
        return supportedMimeTypes.indexOf(mimeType) >= 0;
    }
}