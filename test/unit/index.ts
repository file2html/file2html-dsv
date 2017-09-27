import * as fs from 'fs';
import * as path from 'path';
import {TextDecoder} from 'text-encoding';
import * as mime from 'file2html/lib/mime';
import DSVReader from '../../src/index';

describe('DSVReader', () => {
    let reader: DSVReader;

    beforeAll(() => {
        (window as any).TextDecoder = TextDecoder;
    });

    beforeEach(() => {
        reader = new DSVReader();
    });

    function countMatches (pattern: RegExp, text: string): number {
        let result: number = 0;

        while (pattern.exec(text)) {
            result++;
        }

        return result;
    }

    [
        'sample1.csv',
        'sample2.tsv'
    ].forEach((filename: string) => {
        it(`should read the file ${ filename }`, () => {
            const fileBuffer: Buffer = fs.readFileSync(path.resolve(__dirname, '..', filename));

            return reader.read({
                fileInfo: {
                    content: new Uint8Array(fileBuffer),
                    meta: {
                        name: filename,
                        mimeType: mime.lookup(filename)
                    } as any
                }
            }).then((file) => {
                const {styles, content} = file.getData();
                const cellsCount: number = countMatches(/(<td>|<\/td>)/g, content);
                const rowsCount: number = countMatches(/(<tr>|<\/tr>)/g, content);

                expect(cellsCount).toBeGreaterThan(0);
                expect(cellsCount % 2).toBe(0);
                expect(rowsCount).toBeGreaterThan(1);
                expect(rowsCount % 2).toBe(0);
                expect(styles).toBe('<style></style>');
            });
        });
    });
});