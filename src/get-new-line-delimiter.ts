const carriageReturn: string = '\r';
const lineFeed: string = '\n';

/**
 *
 * @param {string} input
 * @returns {string}
 */
export default function getNewLineDelimiter (input: string): string {
    const text: string = input.substr(0, 1024 * 1024);	// max length 1 MB
    const textSections: string[] = text.split(carriageReturn);
    const {length} = textSections;

    if (length === 1) {
        return lineFeed;
    }

    let newLinesCount: number = 0;

    for (let i = 0; i < length; i++) {
        if (textSections[i][0] === lineFeed) {
            newLinesCount++;
        }
    }

    return newLinesCount >= (length / 2) ? (carriageReturn + lineFeed) : carriageReturn;
}