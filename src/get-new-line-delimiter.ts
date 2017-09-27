/**
 *
 * @param {string} input
 * @returns {string}
 */
export default function getNewLineDelimiter (input: string): RegExp {
    const text: string = input.substr(0, 1024 * 1024);	// max length 1 MB
    const textSections: string[] = text.split('\r');
    const {length} = textSections;

    if (length === 1) {
        return /^\n$/;
    }

    let newLinesCount: number = 0;

    for (let i = 0; i < length; i++) {
        if (textSections[i][0] === '\n') {
            newLinesCount++;
        }
    }

    return newLinesCount >= (length / 2) ? /^\r\n$/ : /^\r$/;
}