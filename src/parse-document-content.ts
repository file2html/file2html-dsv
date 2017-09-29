import getNewLineDelimiter from './get-new-line-delimiter';

export default function parseDocumentContent (fileContent: string, options: {isTSV: boolean}): string {
    const delimiter: string = options.isTSV ? '\t' : ',';
    const delimiterLength: number = delimiter.length;
    const newLineDelimiter: string = getNewLineDelimiter(fileContent);
    const {length} = fileContent;
    let content: string = '';
    let isComment: boolean = false;
    let quotesCount: number = 0;
    let i: number = 0;
    let prevChar: string;
    let char: string = fileContent[i];
    let cellTextContent: string = '';
    let isRowOpened: boolean = false;

    while (i < length) {
        if (char === '#' && !cellTextContent[0]) {
            isComment = true;
        } else if (char === newLineDelimiter || (`${ prevChar }${ char }` === newLineDelimiter)) {
            if (!isComment && isRowOpened) {
                isRowOpened = false;
                content += `<td>${ cellTextContent }</td></tr>`;
                cellTextContent = '';
            }

            isComment = false;
            quotesCount = 0;
        } else if (!isComment) {
            if (char === '"') {
                quotesCount++;
            } else if (
                quotesCount % 2 === 0 &&
                (
                    (char === delimiter) ||
                    (char === delimiter[0] && fileContent.substring(i, i + delimiterLength) === delimiter)
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
                cellTextContent += char;
            }
        }

        i++;
        prevChar = char;
        char = fileContent[i];
    }

    if (isRowOpened) {
        content += `<td>${ cellTextContent }</td></tr>`;
    }

    return `<table><tbody>${ content }</tbody></table>`;
}