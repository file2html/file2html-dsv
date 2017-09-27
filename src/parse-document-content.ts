import getNewLineDelimiter from './get-new-line-delimiter';

export default function parseDocumentContent (fileContent: string, options: {isTSV: boolean}): string {
    const delimiter: string = options.isTSV ? '\t' : ',';
    const delimiterLength: number = delimiter.length;
    const newLineDelimiterPattern: RegExp = getNewLineDelimiter(fileContent);
    const {length} = fileContent;
    let content: string = '';
    let isComment: boolean = false;
    let quotesCount: number = 0;
    let i: number = 0;
    let ch: string = fileContent[i];
    let cellTextContent: string = '';
    let isRowOpened: boolean = false;

    while (i < length) {
        if (ch === '#' && !cellTextContent[0]) {
            isComment = true;
        } else if (newLineDelimiterPattern.test(ch)) {
            if (!isComment && isRowOpened) {
                isRowOpened = false;
                content += `<td>${ cellTextContent }</td></tr>`;
                cellTextContent = '';
            }

            isComment = false;
            quotesCount = 0;
        } else if (!isComment) {
            if (ch === '"') {
                quotesCount++;
            } else if (
                quotesCount % 2 === 0 &&
                (
                    (ch === delimiter) ||
                    (ch === delimiter[0] && fileContent.substring(i, i + delimiterLength) === delimiter)
                )
            ) {
                if (!isRowOpened) {
                    isRowOpened = true;
                    content += '<tr>';
                }

                content += `<td>${ cellTextContent }</td>`;
                cellTextContent = '';

                // -1 because we make i++ each iteration
                i += delimiterLength - 1;
            } else {
                cellTextContent += ch;
            }
        }

        i++;
        ch = fileContent[i];
    }

    if (isRowOpened) {
        content += `<td>${ cellTextContent }</td></tr>`;
    }

    return `<table><tbody>${ content }</tbody></table>`;
}