'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
let csstreeValidator = require('csstree-validator');
function wrapper(options) {
    let report = csstreeValidator.validateString(options.code);
    let diagnostics = [];
    report = Object.keys(report).reduce((r, c) => r.concat(report[c]), []);
    report.forEach(({ line, column, loc, node, message, property }) => {
        let doc = options.document;
        let range = {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 0 }
        };
        let severity = 2 /* Warning */;
        if (loc && loc.start && loc.end) {
            range.start = { line: line - 1, character: column - 1 };
            if (!message.indexOf('Unknown property')) {
                range.end = { line: range.start.line, character: range.start.character + property.length };
            }
            else {
                range.end = { line: loc.end.line - 1, character: loc.end.column - 1 };
            }
        }
        else {
            severity = 1 /* Error */;
            if (node) {
                range.start = { line: node.loc.start.line - 1, character: node.loc.start.column - 1 };
                range.end = { line: node.loc.end.line - 1, character: node.loc.end.column - 1 };
            }
            else {
                range.start = { line: line - 1, character: column - 1 };
                range.end = { line: line - 1, character: column };
            }
        }
        diagnostics.push({
            range,
            severity,
            message: `[CSSTree] ${message}`
        });
    });
    return Promise.resolve(diagnostics);
}
exports.wrapper = wrapper;
;
//# sourceMappingURL=wrapper.js.map