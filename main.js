(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Translator"] = factory();
	else
		root["Translator"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 526:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tokenize = void 0;
function tokenize(source, { isDelimiter, isStringDelimiter, isWhitespace, shouldAddToken, createToken, getCommentStartType, isCommentEnd, getUnclosedComment, offset = 0, }) {
    const tokens = [];
    let previousChar = '';
    let buffer = '';
    let inComment = '';
    let inString = '';
    let start = offset;
    let nextCharIndex = 0;
    for (const ch of source) {
        nextCharIndex += ch.length;
        if (inString) {
            buffer += ch;
            if (ch === inString && previousChar !== '\\') {
                pushBuffer('string');
                inString = '';
            }
        }
        else if (inComment) {
            buffer += ch;
            if (isCommentEnd(inComment, ch, source, nextCharIndex, previousChar)) {
                pushBuffer(inComment);
                inComment = '';
            }
        }
        else if ((inComment = getCommentStartType(ch, source, nextCharIndex))) {
            pushBuffer();
            buffer += ch;
        }
        else if (isStringDelimiter(ch, previousChar)) {
            pushBuffer();
            buffer += ch;
            inString = ch;
        }
        else if (isDelimiter(ch, previousChar)) {
            pushBuffer();
            buffer += ch;
            pushBuffer(ch);
        }
        else if (isWhitespace(ch) && !isWhitespace(previousChar)) {
            pushBuffer();
            buffer += ch;
        }
        else if (!isWhitespace(ch) && isWhitespace(previousChar)) {
            pushBuffer();
            buffer += ch;
        }
        else {
            buffer += ch;
        }
        previousChar = ch;
    }
    if (buffer.length) {
        if (inComment) {
            pushBuffer(getUnclosedComment(inComment));
        }
        else if (inString) {
            pushBuffer('unclosed-string');
        }
        else {
            pushBuffer();
        }
    }
    function pushBuffer(type) {
        if (buffer.length === 0) {
            return;
        }
        const end = start + buffer.length;
        type = type !== null && type !== void 0 ? type : (buffer.trim().length ? 'text' : 'space');
        if (shouldAddToken(type, buffer)) {
            tokens[tokens.length] = createToken(buffer, type, start, end);
        }
        start = end;
        buffer = '';
    }
    return tokens;
}
exports.tokenize = tokenize;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 713:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.last = exports.trimTokens = exports.groupTokens = exports.getText = exports.getUnclosedComment = exports.isCommentEnd = exports.getMultilineCommentStartType = exports.getJSCommentStartType = exports.createToken = exports.isWhitespace = exports.isStringDelimiter = exports.isString = exports.isComment = void 0;
/**
 * Checks if a token type is comment
 */
function isComment(type) {
    return type === 'line-comment' || type === 'multi-comment' || type === 'unclosed-comment';
}
exports.isComment = isComment;
/**
 * Checks if a token type is string
 */
function isString(type) {
    return type === 'string' || type === 'unclosed-string';
}
exports.isString = isString;
/**
 * Checks for a set of JS strings
 */
const isStringDelimiter = (char) => char === `'` || char === `"` || char === '`';
exports.isStringDelimiter = isStringDelimiter;
/**
 * Checks for a set of Whitespace
 */
const isWhitespace = (char) => char === ' ' || char === `\t` || char === `\r` || char === '\n';
exports.isWhitespace = isWhitespace;
/**
 * Creates a basic token
 */
const createToken = (value, type, start, end) => {
    return {
        value,
        type,
        start,
        end,
    };
};
exports.createToken = createToken;
/**
 * Get JS type of comments for a specific set of start chars when no comment is detected empty string is used
 */
function getJSCommentStartType(ch, source, nextCharIndex) {
    if (ch === '/' && source[nextCharIndex] === '/') {
        return 'line-comment';
    }
    else {
        return ch === '/' && source[nextCharIndex] === '*' ? 'multi-comment' : '';
    }
}
exports.getJSCommentStartType = getJSCommentStartType;
/**
 * Get CSS type of comments for a specific set of start chars when no comment is detected empty string is used
 */
function getMultilineCommentStartType(ch, source, nextCharIndex) {
    return ch === '/' && source[nextCharIndex] === '*' ? 'multi-comment' : '';
}
exports.getMultilineCommentStartType = getMultilineCommentStartType;
/**
 * Given a JS comment type determine if this is the end of the comment
 */
function isCommentEnd(commentType, ch, _source, _nextCharIndex, previousChar) {
    if (commentType === 'line-comment' && ch === '\n') {
        return true;
    }
    else if (commentType === 'multi-comment' && ch === '/' && previousChar === '*') {
        return true;
    }
    return false;
}
exports.isCommentEnd = isCommentEnd;
/**
 * Get the type of unclosed comment
 */
function getUnclosedComment(commentType) {
    if (commentType === 'line-comment') {
        return commentType;
    }
    else {
        return 'unclosed-comment';
    }
}
exports.getUnclosedComment = getUnclosedComment;
/**
 * Get the text between two token indexes
 * if source is provided it will slice the text from original source
 * otherwise the value of the tokens will be concatenated
 */
function getText(tokens, startIndex = 0, upToIndex = -1, source) {
    if (tokens.length === 0) {
        return '';
    }
    if (upToIndex === -1) {
        upToIndex = tokens.length;
    }
    if (source) {
        return source.slice(tokens[startIndex].start, tokens[upToIndex - 1].end);
    }
    else {
        let res = '';
        for (let i = startIndex; i < upToIndex; i++) {
            res += tokens[i].value;
        }
        return res;
    }
}
exports.getText = getText;
/**
 * Takes an array of tokens and group them into a single token.
 * If source is provided the value will contain the text between the tokens,
 * instead of the tokens concatenated text.
 */
function groupTokens(tokens, type = 'tokens', source) {
    return {
        type,
        start: tokens[0].start,
        end: tokens[tokens.length - 1].end,
        value: getText(tokens, undefined, undefined, source),
        tokens,
    };
}
exports.groupTokens = groupTokens;
/**
 * Trim tokens from both ends with a matcher function
 */
function trimTokens(tokens, shouldTrimToken) {
    let start = 0;
    let end = tokens.length;
    for (let i = 0; i < tokens.length; i++) {
        if (shouldTrimToken(tokens[i])) {
            start = i + 1;
        }
        else {
            break;
        }
    }
    for (let i = tokens.length - 1; i > start; i--) {
        if (shouldTrimToken(tokens[i])) {
            end = i;
        }
        else {
            break;
        }
    }
    return tokens.slice(start, end);
}
exports.trimTokens = trimTokens;
/**
 * get last item in array
 */
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ 461:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(921), exports);
__exportStar(__webpack_require__(526), exports);
__exportStar(__webpack_require__(713), exports);
__exportStar(__webpack_require__(277), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 277:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Seeker = void 0;
/**
 * Minimal token traverse helper used to create structure from tokens
 */
class Seeker {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = -1;
    }
    next() {
        this.index++;
        return this.tokens[this.index] || { type: '' };
    }
    back() {
        this.index--;
    }
    peekBack() {
        return this.tokens[this.index - 1] || { type: '' };
    }
    peek(num = 1) {
        return this.tokens[this.index + num] || { type: '' };
    }
    take(type) {
        if (this.peek().type === type) {
            return this.next();
        }
        return undefined;
    }
    eat(type) {
        while (this.peek().type === type) {
            this.index++;
        }
        return this;
    }
    takeMany(type) {
        const tokens = [];
        while (this.peek().type === type) {
            tokens.push(this.next());
        }
        return tokens;
    }
    flatBlock(start, end, isEndError) {
        let token = this.next();
        if (token.type !== start) {
            return [];
        }
        const block = [];
        let endIndex;
        while ((token = this.next())) {
            if (!token.type) {
                if (endIndex !== undefined) {
                    this.index = endIndex - 1;
                }
                return;
            }
            if (isEndError && isEndError(token)) {
                endIndex = this.index;
            }
            if (token.type === end) {
                return block;
            }
            else {
                block.push(token);
            }
        }
        return [];
    }
    done() {
        return this.index >= this.tokens.length - 1;
    }
    run(handleToken, ast, source) {
        let token;
        while ((token = this.next()) && token.type) {
            if (handleToken(token, ast, source, this) === false) {
                break;
            }
        }
        return ast;
    }
}
exports.Seeker = Seeker;
//# sourceMappingURL=seeker.js.map

/***/ }),

/***/ 921:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 231:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitCompoundSelectors = exports.groupCompoundSelectors = void 0;
const walk_1 = __webpack_require__(439);
function groupCompoundSelectors(input, options) {
    const context = createCompoundContext(options);
    (0, walk_1.walk)(input, (node, _index, _nodes, parents) => {
        if (parents.length === 0 && node.type === `selector`) {
            // first level: create top level selector
            context.addSelector(node);
        }
        else {
            // second level: (parents.length === 1)
            if ((options === null || options === void 0 ? void 0 : options.deep) && `nodes` in node) {
                // compound nested selectors
                /* This `nodes` type is hard since it's internal we use any[] here. sorry */
                const nodes = [];
                for (const nested of node.nodes) {
                    nodes.push(nested.type === `selector`
                        ? groupCompoundSelectors(nested, options)
                        : nested);
                }
                node = { ...node, nodes };
            }
            context.handleNode(node);
            // don't go deeper - shallow group
            return walk_1.walk.skipNested;
        }
        return;
    });
    return `length` in input ? context.output : context.output[0];
}
exports.groupCompoundSelectors = groupCompoundSelectors;
function createCompoundContext({ splitPseudoElements = true } = {}) {
    const output = [];
    let lastSelector;
    let lastCompound;
    let lastCompoundInitialPart;
    const handleNode = (node) => {
        if (node.type === `pseudo_element` && splitPseudoElements === true) {
            lastCompound = undefined;
        }
        if (node.type === `combinator`) {
            lastSelector.nodes.push(node);
            lastCompound = undefined;
        }
        else if (node.type === `comment` && !isCommentWithNoSpacing(node)) {
            // comment that breaks compound
            lastSelector.nodes.push(node);
            lastCompound = undefined;
        }
        else if (node.type === `type` ||
            node.type === `universal` ||
            node.type === `class` ||
            node.type === `id` ||
            node.type === `attribute` ||
            node.type === `nesting` ||
            node.type === `pseudo_class` ||
            node.type === `pseudo_element` ||
            node.type === `invalid` ||
            node.type === `comment` /*no spacing*/) {
            // part of compound
            if (!lastCompound) {
                // add new compound selector
                lastCompoundInitialPart = undefined;
                lastCompound = {
                    type: `compound_selector`,
                    start: node.start,
                    end: node.end,
                    before: ``,
                    after: ``,
                    nodes: [],
                    invalid: false,
                };
                lastSelector.nodes.push(lastCompound);
            }
            if (!lastCompound.invalid && node.type !== `comment`) {
                // validate compound parts after initial
                if (lastCompoundInitialPart) {
                    lastCompound.invalid = node.type === `universal` || node.type === `type`;
                }
                lastCompoundInitialPart = node;
            }
            lastCompound.nodes.push(node);
            lastCompound.end = node.end;
        }
        else if (node.type === `selector` || node.type === `compound_selector`) {
            // spread
            for (const innerNode of node.nodes) {
                handleNode(innerNode);
            }
        }
        else {
            // handle out of context nodes
            lastSelector.nodes.push(node);
            lastCompound = undefined;
        }
    };
    return {
        addSelector(node) {
            lastSelector = {
                type: `selector`,
                start: node.start,
                end: node.end,
                before: `before` in node ? node.before : ``,
                after: `after` in node ? node.after : ``,
                nodes: [],
            };
            output.push(lastSelector);
            lastCompound = undefined;
        },
        handleNode,
        output,
    };
}
function splitCompoundSelectors(input) {
    const inputSelectors = Array.isArray(input) ? input : [input];
    const output = [];
    for (const inputSelector of inputSelectors) {
        const outputSelector = {
            ...inputSelector,
            nodes: [],
        };
        for (const node of inputSelector.nodes) {
            if (node.type === `compound_selector`) {
                outputSelector.nodes.push(...node.nodes);
            }
            else {
                outputSelector.nodes.push(node);
            }
        }
        output.push(outputSelector);
    }
    return `length` in input ? output : output[0];
}
exports.splitCompoundSelectors = splitCompoundSelectors;
function isCommentWithNoSpacing(node) {
    return node.type === `comment` && node.before === `` && node.after === ``;
}
//# sourceMappingURL=compound.js.map

/***/ }),

/***/ 621:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compareSpecificity = exports.calcSpecificity = void 0;
const walk_1 = __webpack_require__(439);
function calcSpecificity(ast) {
    const result = [0, 0, 0, 0];
    // ToDo: remove casting once immutable walk is supported
    (0, walk_1.walk)(ast, (node) => {
        switch (node.type) {
            case `type`:
            case `pseudo_element`:
                result[3]++;
                break;
            case `class`:
            case `attribute`:
                result[2]++;
                break;
            case `pseudo_class`:
                if (customPseudoClass[node.value]) {
                    customPseudoClass[node.value](node, result);
                    return walk_1.walk.skipNested;
                }
                result[2]++;
                break;
            case `id`:
                result[1]++;
                break;
        }
        return node.type !== `selector` && node.type !== `compound_selector`
            ? walk_1.walk.skipNested
            : undefined;
    });
    return result;
}
exports.calcSpecificity = calcSpecificity;
const customPseudoClass = {
    not: mostSpecificInnerSelector,
    is: mostSpecificInnerSelector,
    has: mostSpecificInnerSelector,
    where: () => {
        /* no specificity*/
    },
    'nth-child': pseudoClassPlusMostSpecificInnerSelector,
    'nth-last-child': pseudoClassPlusMostSpecificInnerSelector,
    'nth-of-type': pseudoClassPlusMostSpecificInnerSelector,
    'nth-last-of-type': pseudoClassPlusMostSpecificInnerSelector,
};
function pseudoClassPlusMostSpecificInnerSelector(node, result) {
    result[2]++;
    mostSpecificInnerSelector(node, result);
}
function mostSpecificInnerSelector(node, result) {
    var _a;
    if ((_a = node.nodes) === null || _a === void 0 ? void 0 : _a.length) {
        let highest = [0, 0, 0, 0];
        for (const selector of node.nodes) {
            const currentSpecificity = calcSpecificity(selector);
            if (!highest || compareSpecificity(currentSpecificity, highest) === 1) {
                highest = currentSpecificity;
            }
        }
        addSpecificity(result, highest);
    }
}
/**
 * compare 2 specificities
 * @param a first specificity
 * @param b second specificity
 * @returns 0 if equal, 1 when a is more specific, -1 when b is more specific
 */
function compareSpecificity(a, b) {
    for (let i = 0; i < 4; ++i) {
        const specificityDiff = a[i] - b[i];
        if (specificityDiff > 0) {
            return 1;
        }
        else if (specificityDiff < 0) {
            return -1;
        }
    }
    return 0;
}
exports.compareSpecificity = compareSpecificity;
/**
 * mutate the first value, adding the second one
 * @param to specificity reference to to
 * @param from specificity amount to add
 */
function addSpecificity(to, from) {
    for (let i = 0; i < 4; ++i) {
        to[i] += from[i];
    }
}
//# sourceMappingURL=specificity.js.map

/***/ }),

/***/ 439:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.walk = void 0;
const nestEnd = Symbol(`nest-end`);
function walk(topNode, visit, options = {}) {
    var _a;
    // set initial top nodes to traverse
    const toVisit = Array.isArray(topNode)
        ? [...topNode]
        : [topNode];
    // initiate context
    const context = createWalkContext(topNode);
    // iterate nodes
    while (toVisit.length) {
        const current = toVisit.shift();
        if (current === nestEnd) {
            // end of nested level
            context.up();
            continue;
        }
        else if ((!options.ignoreList || !options.ignoreList.includes(current.type)) &&
            (!options.visitList || options.visitList.includes(current.type))) {
            // visit node
            let skipAmount = (_a = visit(current, context.indexInSelector, context.nodesInSelector, context.parents)) !== null && _a !== void 0 ? _a : -1;
            // point to next selector node
            context.next();
            // check if to skip nested or current/following selectors
            if (skipAmount === Infinity) {
                // stop all: fast bail out
                return;
            }
            else if (skipAmount >= 0) {
                // skip levels
                while (skipAmount > 0 && toVisit.length) {
                    const next = toVisit.shift();
                    if (next === nestEnd) {
                        skipAmount--;
                        context.up();
                    }
                }
                continue;
            }
        }
        else {
            // point to next selector node
            context.next();
        }
        // add nested nodes
        if (isWithNodes(current)) {
            context.insertNested(current);
            toVisit.unshift(...current.nodes, nestEnd);
        }
    }
}
exports.walk = walk;
function createWalkContext(topNode) {
    const prevIndex = [];
    const prevParents = [[]];
    const context = {
        parents: [],
        indexInSelector: 0,
        nodesInSelector: Array.isArray(topNode)
            ? topNode
            : `nodes` in topNode
                ? topNode.nodes
                : [topNode],
        up() {
            context.parents.pop();
            context.indexInSelector = prevIndex.shift();
            const currentParents = context.parents;
            const currentParent = currentParents[currentParents.length - 1];
            context.nodesInSelector = currentParent ? currentParent.nodes : topNode;
        },
        next() {
            context.indexInSelector++;
        },
        insertNested(node) {
            context.parents = [...context.parents, node];
            prevParents.push(context.parents);
            prevIndex.unshift(context.indexInSelector);
            context.indexInSelector = 0;
            context.nodesInSelector = node.nodes;
        },
    };
    return context;
}
walk.skipNested = 0;
walk.skipCurrentSelector = 1;
walk.stopAll = Infinity;
function isWithNodes(node) {
    return node && `nodes` in node;
}
//# sourceMappingURL=walk.js.map

/***/ }),

/***/ 946:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=ast-types.js.map

/***/ }),

/***/ 534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trimCombinators = exports.ensureSelector = exports.isNamespacedAst = exports.isNamespacedToken = exports.isCombinatorToken = exports.createCommentAst = exports.createCombinatorAst = exports.createEmptyNth = exports.createEmptySelector = void 0;
const core_1 = __webpack_require__(461);
// create ast nodes
function createEmptySelector() {
    return {
        type: 'selector',
        start: -1,
        end: -1,
        before: '',
        after: '',
        nodes: [],
    };
}
exports.createEmptySelector = createEmptySelector;
function createEmptyNth() {
    return {
        type: 'nth',
        start: -1,
        end: -1,
        before: '',
        after: '',
        nodes: [],
    };
}
exports.createEmptyNth = createEmptyNth;
function createCombinatorAst({ value, type, start, end, }) {
    return {
        type: `combinator`,
        combinator: type,
        value: type === `space` ? ` ` : value,
        start,
        end,
        before: ``,
        after: type === `space` ? value.slice(1) : ``,
        invalid: false,
    };
}
exports.createCombinatorAst = createCombinatorAst;
function createCommentAst({ value, start, end }) {
    return {
        type: `comment`,
        value,
        start,
        end,
        before: ``,
        after: ``,
    };
}
exports.createCommentAst = createCommentAst;
// type guards
function isCombinatorToken(token) {
    return token.type === 'space' || token.type === '+' || token.type === '>' || token.type === '~';
}
exports.isCombinatorToken = isCombinatorToken;
function isNamespacedToken(token) {
    return token.type === `*` || token.type === `text`;
}
exports.isNamespacedToken = isNamespacedToken;
function isNamespacedAst(token) {
    return token.type === `universal` || token.type === `type`;
}
exports.isNamespacedAst = isNamespacedAst;
// utils
function ensureSelector(selectors, startToken) {
    let lastSelector = (0, core_1.last)(selectors);
    if (!lastSelector) {
        lastSelector = createEmptySelector();
        lastSelector.start = startToken.start;
        selectors.push(lastSelector);
    }
    return lastSelector;
}
exports.ensureSelector = ensureSelector;
function trimCombinators(selector) {
    // costly way to turn combinators to before and after.
    // this can be inlined in the handle token process
    const nodes = selector.nodes;
    const firstNode = nodes[0];
    const lastNode = (0, core_1.last)(nodes);
    // remove first space combinator and add to selector before
    // (going between comment is not required for the start because they are taken care
    // of during parsing)
    if ((firstNode === null || firstNode === void 0 ? void 0 : firstNode.type) === 'combinator' && firstNode.combinator === 'space') {
        selector.nodes.shift();
        selector.before += firstNode.before + firstNode.value + firstNode.after;
    }
    // remove any edge space combinators (last and between comments)
    if (lastNode && lastNode !== firstNode) {
        let index = nodes.length - 1;
        let current = lastNode;
        let lastComment;
        while (current.type === `comment` ||
            (current.type === `combinator` && current.combinator === `space`)) {
            if (current.type === `combinator`) {
                if (!lastComment) {
                    // attach space to end of selector
                    selector.nodes.pop();
                    selector.after += current.before + current.value + current.after;
                }
                else {
                    // attach space to start of comment
                    selector.nodes.splice(index, 1);
                    lastComment.before += current.before + current.value + current.after;
                    lastComment.start = current.start;
                }
            }
            else {
                lastComment = current;
            }
            current = nodes[--index];
        }
    }
}
exports.trimCombinators = trimCombinators;
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ 774:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compareSpecificity = exports.calcSpecificity = exports.splitCompoundSelectors = exports.groupCompoundSelectors = exports.walk = exports.stringifySelectorAst = exports.parseCssSelector = void 0;
var selector_parser_1 = __webpack_require__(742);
Object.defineProperty(exports, "parseCssSelector", ({ enumerable: true, get: function () { return selector_parser_1.parseCssSelector; } }));
__exportStar(__webpack_require__(946), exports);
var stringify_1 = __webpack_require__(380);
Object.defineProperty(exports, "stringifySelectorAst", ({ enumerable: true, get: function () { return stringify_1.stringifySelectorAst; } }));
var walk_1 = __webpack_require__(439);
Object.defineProperty(exports, "walk", ({ enumerable: true, get: function () { return walk_1.walk; } }));
var compound_1 = __webpack_require__(231);
Object.defineProperty(exports, "groupCompoundSelectors", ({ enumerable: true, get: function () { return compound_1.groupCompoundSelectors; } }));
Object.defineProperty(exports, "splitCompoundSelectors", ({ enumerable: true, get: function () { return compound_1.splitCompoundSelectors; } }));
var specificity_1 = __webpack_require__(621);
Object.defineProperty(exports, "calcSpecificity", ({ enumerable: true, get: function () { return specificity_1.calcSpecificity; } }));
Object.defineProperty(exports, "compareSpecificity", ({ enumerable: true, get: function () { return specificity_1.compareSpecificity; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 780:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NthParser = void 0;
const helpers_1 = __webpack_require__(534);
const core_1 = __webpack_require__(461);
class NthParser {
    constructor(selectorNode, s) {
        this.selectorNode = selectorNode;
        this.s = s;
        this.state = `step`;
        this.standaloneDash = false;
        this.ast = selectorNode.nodes;
    }
    static isNthPseudoClass(name) {
        return (name === `nth-child` ||
            name === `nth-last-child` ||
            name === `nth-of-type` ||
            name === `nth-last-of-type`);
    }
    handleToken(token) {
        const type = token.type;
        if (type === `text` || type === `+`) {
            switch (this.state) {
                case `step`: {
                    // pickup 1 or more tokens for `5n` / `+5n` / `+5n-4` / `5`
                    const nextToken = type === `+` && this.s.peek().type === `text` ? this.s.next() : undefined;
                    this.breakFirstChunk({
                        type: `text`,
                        value: token.value + ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.value) || ``),
                        start: token.start,
                        end: (nextToken === null || nextToken === void 0 ? void 0 : nextToken.end) || token.end,
                    });
                    return true;
                }
                case `dash`: {
                    const nextToken = type === `+` && this.s.peek().type === `text` ? this.s.next() : undefined;
                    this.pushDash({
                        type: `text`,
                        value: token.value + ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.value) || ``),
                        start: token.start,
                        end: (nextToken === null || nextToken === void 0 ? void 0 : nextToken.end) || token.end,
                    });
                    return true;
                }
                case `offset`: {
                    const nextToken = type === `+` && this.s.peek().type === `text` ? this.s.next() : undefined;
                    this.pushOffset({
                        type: `text`,
                        value: token.value + ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.value) || ``),
                        start: token.start,
                        end: (nextToken === null || nextToken === void 0 ? void 0 : nextToken.end) || token.end,
                    });
                    return true;
                }
                case `of`: {
                    this.pushOf(token);
                    return false;
                }
            }
        }
        else if (type === `space`) {
            // improve typing
            const lastNode = (0, core_1.last)(this.ast);
            if (lastNode) {
                lastNode.after += token.value;
                lastNode.end += token.value.length;
            }
            else {
                // add initial space to top selector
                this.selectorNode.before += token.value;
            }
            return true;
        }
        else if ((0, core_1.isComment)(type)) {
            this.ast.push((0, helpers_1.createCommentAst)(token));
            return true;
        }
        // not part of `An+b of`: bail out
        this.s.back();
        return false;
    }
    /**
     * first token can only be (minus contained in text):
     * step: `5n`/`+5n`/`-5n`
     * step & offset: `5n`/`5n-5
     */
    breakFirstChunk(token) {
        const value = token.value;
        // find odd/even
        const oddEventMatch = value.match(NthParser.oddEvenStep);
        if (oddEventMatch) {
            const isInvalid = !!oddEventMatch[1];
            this.pushStep(token, isInvalid);
            return;
        }
        // separate valid step start from rest: `-5n-4` / `-5n` / `-4` / `5n-4`
        const matchValidStart = value.match(NthParser.nthStartExp);
        if (!matchValidStart) {
            // invalid step
            this.pushStep(token);
        }
        else {
            const step = matchValidStart[1];
            const offset = matchValidStart[2];
            if (!offset && !step.match(/[nN]+$/) && step.match(NthParser.validOffset)) {
                // no `n` - just offset
                this.pushOffset(token);
            }
            else if (offset === `-`) {
                // connected dash: `5n-`
                this.pushStep({
                    type: `text`,
                    value: step,
                    start: token.start,
                    end: token.start + step.length,
                });
                this.pushDash({
                    type: `text`,
                    value: `-`,
                    start: token.end - 1,
                    end: token.end,
                });
            }
            else if (offset && !offset.match(/-\d+/)) {
                // invalid step: `-3x`
                this.pushStep(token);
            }
            else {
                // step with potential minus offset: `5n-4`
                this.pushStep({
                    type: `text`,
                    value: step,
                    start: token.start,
                    end: token.start + step.length,
                });
                if (offset) {
                    this.pushOffset({
                        type: `text`,
                        value: offset,
                        start: token.end - offset.length,
                        end: token.end,
                    });
                }
            }
        }
    }
    pushStep(token, isInvalid) {
        const value = token.value;
        const stepNode = {
            type: `nth_step`,
            value,
            before: ``,
            after: ``,
            start: token.start,
            end: token.end,
        };
        isInvalid = isInvalid !== undefined ? isInvalid : !value.match(NthParser.validStep);
        if (isInvalid) {
            stepNode.invalid = true;
        }
        this.state = `dash`;
        this.ast.push(stepNode);
    }
    pushDash(token) {
        const value = token.value;
        if (value === `+` || value === `-`) {
            this.ast.push({
                type: `nth_dash`,
                value: token.value,
                start: token.start,
                end: token.end,
                before: ``,
                after: ``,
            });
            this.standaloneDash = true;
            this.state = `offset`;
        }
        else {
            this.pushOffset(token);
        }
    }
    pushOffset(token) {
        if (token.value === `of`) {
            this.pushOf(token);
        }
        else {
            const value = token.value;
            const offsetNode = {
                type: `nth_offset`,
                value,
                before: ``,
                after: ``,
                start: token.start,
                end: token.end,
            };
            if (!value.match(NthParser.validOffset) ||
                (this.standaloneDash && value.match(/^[-+]/))) {
                offsetNode.invalid = true;
            }
            this.state = `of`;
            this.ast.push(offsetNode);
        }
    }
    pushOf(token) {
        const ofNode = {
            type: `nth_of`,
            value: token.value,
            before: ``,
            after: ``,
            start: token.start,
            end: token.end,
        };
        if (token.value !== `of`) {
            ofNode.invalid = true;
        }
        this.ast.push(ofNode);
        this.state = `selector`;
    }
}
exports.NthParser = NthParser;
/**
 * check (case insensitive) and returns 2 groups:
 * 1. plus/minus sign (invalid step value)
 * 2. odd/even string
 * [
 *  `+`|`-`|undefined,
 *  `odd`|`even`
 * ]
 */
NthParser.oddEvenStep = /([-+]?)(odd|even)/i;
/**
 * check for valid step
 * starts with optional minus or plus,
 * ends with 0 or more digits following a `n`/`N` character
 */
NthParser.validStep = /^[-+]?\d*n$/i;
/**
 * check for valid offset
 * starts with optional minus or plus,
 * ends with 1 or more digits
 */
NthParser.validOffset = /^[-+]?\d+$/;
/**
 * check for valid start of nth expression
 * and returns 2 groups:
 * 1. An: optional minus or plus, 0 or more digits, `n`/`N` character
 * 2. anything after that
 */
NthParser.nthStartExp = /([-+]?\d*[nN]?)(.*)/;
//# sourceMappingURL=nth-parser.js.map

/***/ }),

/***/ 742:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseCssSelector = void 0;
const tokenizer_1 = __webpack_require__(467);
const nth_parser_1 = __webpack_require__(780);
const helpers_1 = __webpack_require__(534);
const core_1 = __webpack_require__(461);
function parseCssSelector(source, options = {}) {
    return parseTokens(source, (0, tokenizer_1.tokenizeSelector)(source, options));
}
exports.parseCssSelector = parseCssSelector;
function parseTokens(source, tokens) {
    return new core_1.Seeker(tokens).run(handleToken, [], source);
}
function handleToken(token, selectors, source, s) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    let t;
    const currentSelector = (0, helpers_1.ensureSelector)(selectors, token);
    const ast = currentSelector.nodes;
    if (token.type === '.') {
        const comments = s.takeMany('multi-comment').map(helpers_1.createCommentAst);
        const name = s.take('text');
        ast.push({
            type: 'class',
            value: (_a = name === null || name === void 0 ? void 0 : name.value) !== null && _a !== void 0 ? _a : '',
            start: token.start,
            end: (_d = (_b = name === null || name === void 0 ? void 0 : name.end) !== null && _b !== void 0 ? _b : (_c = (0, core_1.last)(comments)) === null || _c === void 0 ? void 0 : _c.end) !== null && _d !== void 0 ? _d : token.end,
            dotComments: comments,
        });
    }
    else if (token.type === ':') {
        const firstComments = s.takeMany('multi-comment').map(helpers_1.createCommentAst);
        const type = s.take(':') || token;
        const isClass = token === type;
        if (isClass) {
            const name = s.take('text');
            const endToken = name || (0, core_1.last)(firstComments) || type;
            ast.push({
                type: 'pseudo_class',
                value: (_e = name === null || name === void 0 ? void 0 : name.value) !== null && _e !== void 0 ? _e : '',
                start: token.start,
                end: (_f = name === null || name === void 0 ? void 0 : name.end) !== null && _f !== void 0 ? _f : endToken.end,
                colonComments: firstComments,
            });
        }
        else {
            const secondComments = s.takeMany('multi-comment').map(helpers_1.createCommentAst);
            const name = s.take('text');
            const endToken = name || (0, core_1.last)(secondComments) || type;
            ast.push({
                type: 'pseudo_element',
                value: (_g = name === null || name === void 0 ? void 0 : name.value) !== null && _g !== void 0 ? _g : '',
                start: token.start,
                end: (_h = name === null || name === void 0 ? void 0 : name.end) !== null && _h !== void 0 ? _h : endToken.end,
                colonComments: { first: firstComments, second: secondComments },
            });
        }
    }
    else if (token.type === '[') {
        const block = s.run((token, ast) => {
            ast.push(token);
            return token.type !== ']';
        }, [token], source);
        const closed = ((_j = (0, core_1.last)(block)) === null || _j === void 0 ? void 0 : _j.type) === ']';
        if (closed) {
            ast.push({
                type: 'attribute',
                value: block.length > 2 ? (0, core_1.getText)(block, 1, block.length - 1, source) : '',
                start: token.start,
                end: (_l = (_k = (0, core_1.last)(block)) === null || _k === void 0 ? void 0 : _k.end) !== null && _l !== void 0 ? _l : token.end,
            });
        }
        else {
            ast.push({
                type: 'invalid',
                value: (0, core_1.getText)(block, undefined, undefined, source),
                start: token.start,
                end: (_o = (_m = (0, core_1.last)(block)) === null || _m === void 0 ? void 0 : _m.end) !== null && _o !== void 0 ? _o : token.end,
            });
        }
    }
    else if ((0, helpers_1.isCombinatorToken)(token)) {
        let lastCombinatorAst = (0, helpers_1.createCombinatorAst)(token);
        let lastAst = lastCombinatorAst;
        // insert token as a combinator
        ast.push(lastCombinatorAst);
        // save the insertion point of the first combinator in case it's a space
        // that might be considered a normal space later and will need to be changed.
        let initialSpaceCombIndex = lastCombinatorAst.combinator === `space` ? ast.length - 1 : -1;
        /**
         * take next spaces/combinators/comments:
         * - combinator/space token:
         *  - spaces: merge to previous ast node before them
         *  - previous ast equal to space combinator
         *    - turn previous ast to the next combinator type
         *    - merge spaces between them
         *    - cancel initial space tracking - must be merged with other non space combinator or already canceled
         *  - initial ast is space (must be comments following it)
         *    - initial space is first in selector: merge initial ast into the selector before
         *    - otherwise merge initial ast the comment following it
         *  - insert an invalid combinator
         * - comment token: insert to ast
         */
        //
        let next = s.next();
        while (next) {
            if ((0, helpers_1.isCombinatorToken)(next)) {
                if (next.type === `space`) {
                    // add space to the last ast node
                    lastAst.after += next.value;
                    lastAst.end = next.end;
                }
                else if (lastAst === lastCombinatorAst && lastAst.combinator === 'space') {
                    // combine next combinator into previous (space)
                    const nextCombinator = (0, helpers_1.createCombinatorAst)(next);
                    lastCombinatorAst.combinator = nextCombinator.combinator;
                    lastCombinatorAst.before +=
                        lastCombinatorAst.after + lastCombinatorAst.value + nextCombinator.before;
                    lastCombinatorAst.after = nextCombinator.after;
                    lastCombinatorAst.value = nextCombinator.value;
                    lastCombinatorAst.end = nextCombinator.end;
                    // reset initial space
                    initialSpaceCombIndex = -1;
                }
                else if (initialSpaceCombIndex !== -1) {
                    // merge initial space combinator (classified as combinator before a comment)
                    const initialSpace = ast[initialSpaceCombIndex];
                    const spaceValue = initialSpace.before + initialSpace.value + initialSpace.after;
                    if (initialSpaceCombIndex === 0) {
                        // merge to beginning of selector
                        currentSelector.before += spaceValue;
                    }
                    else {
                        // merge to the next comment
                        const nodeAfterInitial = ast[initialSpaceCombIndex + 1];
                        if ((nodeAfterInitial === null || nodeAfterInitial === void 0 ? void 0 : nodeAfterInitial.type) === `comment`) {
                            nodeAfterInitial.before += spaceValue;
                            nodeAfterInitial.start = initialSpace.start;
                        }
                        else {
                            // shouldn't happen as initial space is considered as a combinator
                            // only when a comment is following it and before
                        }
                    }
                    ast.splice(initialSpaceCombIndex, 1);
                    initialSpaceCombIndex = -1;
                    // add combinator
                    lastCombinatorAst = (0, helpers_1.createCombinatorAst)(next);
                    lastAst = lastCombinatorAst;
                    ast.push(lastCombinatorAst);
                }
                else {
                    // add invalid combinator
                    lastCombinatorAst = (0, helpers_1.createCombinatorAst)(next);
                    lastCombinatorAst.invalid = true;
                    lastAst = lastCombinatorAst;
                    ast.push(lastCombinatorAst);
                }
            }
            else if ((0, core_1.isComment)(next.type)) {
                lastAst = (0, helpers_1.createCommentAst)(next);
                ast.push(lastAst);
            }
            else {
                break;
            }
            next = s.next();
        }
        // put back any unrelated token
        if (next && !(0, helpers_1.isCombinatorToken)(next)) {
            s.back();
        }
    }
    else if (token.type === 'text') {
        ast.push({
            type: 'type',
            value: token.value,
            start: token.start,
            end: token.end,
        });
    }
    else if (token.type === '#') {
        t = s.take('text');
        ast.push({
            type: 'id',
            value: (_p = t === null || t === void 0 ? void 0 : t.value) !== null && _p !== void 0 ? _p : '',
            start: token.start,
            end: (_q = t === null || t === void 0 ? void 0 : t.end) !== null && _q !== void 0 ? _q : token.end,
        });
    }
    else if (token.type === '*') {
        ast.push({
            type: 'universal',
            value: '*',
            start: token.start,
            end: token.end,
        });
    }
    else if (token.type === '|') {
        // search backwards compatible namespace in ast
        let prevAst;
        let prevInvalidAst;
        const beforeComments = [];
        for (let i = ast.length - 1; i >= 0; --i) {
            const current = ast[i];
            if ((0, helpers_1.isNamespacedAst)(current)) {
                if (current.namespace) {
                    // already namespaced
                    prevInvalidAst = current;
                }
                else {
                    // merge with previous
                    prevAst = current;
                }
                break;
            }
            else if (current.type === `comment` &&
                current.before === `` &&
                current.after === ``) {
                beforeComments.unshift(current);
            }
            else {
                prevInvalidAst = current;
                break;
            }
        }
        // search forward target token
        let target;
        let searchIndex = 1;
        const potentialAfterComments = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const nextToken = s.peek(searchIndex);
            if ((0, core_1.isComment)(nextToken.type)) {
                potentialAfterComments.push(nextToken);
            }
            else if ((0, helpers_1.isNamespacedToken)(nextToken)) {
                target = nextToken;
                break;
            }
            else {
                // space or end of tokens
                break;
            }
            searchIndex++;
        }
        // create/update ast
        const validNamespace = !prevInvalidAst;
        const validTarget = !!target;
        const type = (target === null || target === void 0 ? void 0 : target.type) === `*` ? `universal` : `type`;
        let invalid = ``;
        // remove before/after pipe comments
        if (validNamespace) {
            ast.splice(ast.length - beforeComments.length, beforeComments.length);
        }
        else {
            invalid = `namespace`;
        }
        if (validTarget) {
            potentialAfterComments.forEach(() => s.next());
            s.next();
        }
        else {
            invalid = invalid ? `namespace,target` : `target`;
        }
        // create new ast or modify the prev
        const nsAst = prevAst ||
            {
                type,
                value: ``,
                start: token.start,
                end: (target === null || target === void 0 ? void 0 : target.end) || token.end,
            };
        nsAst.type = type;
        nsAst.namespace = {
            value: (prevAst === null || prevAst === void 0 ? void 0 : prevAst.value) || ``,
            beforeComments: validNamespace ? beforeComments : [],
            afterComments: validTarget ? potentialAfterComments.map(helpers_1.createCommentAst) : [],
        };
        nsAst.value = (target === null || target === void 0 ? void 0 : target.value) || ``;
        nsAst.end = (target === null || target === void 0 ? void 0 : target.end) || token.end;
        // set invalid
        if (invalid) {
            nsAst.namespace.invalid = invalid;
        }
        // add ast if not modified
        if (!prevAst) {
            ast.push(nsAst);
        }
    }
    else if (token.type === '(') {
        const prev = (0, core_1.last)(ast);
        const res = [];
        // handle nth selector
        if (prev &&
            prev.type === `pseudo_class` &&
            nth_parser_1.NthParser.isNthPseudoClass(prev.value) &&
            s.peek().type !== `)`) {
            // collect "An+B of" expression
            const nthSelector = (0, helpers_1.createEmptyNth)();
            nthSelector.start = s.peek().start;
            res.push(nthSelector);
            const nthParser = new nth_parser_1.NthParser(nthSelector, s);
            s.run((token) => {
                if (nthParser.state === `selector`) {
                    // got to selector, push back and stop
                    s.back();
                    return false;
                }
                return nthParser.handleToken(token);
            }, nthSelector, source);
            // setup next selector
            if (s.peek().type !== `)`) {
                nthSelector.end = ((_r = (0, core_1.last)(nthSelector.nodes)) === null || _r === void 0 ? void 0 : _r.end) || nthSelector.start;
                // add "of" selector
                const newSelector = (0, helpers_1.createEmptySelector)();
                newSelector.start = nthSelector.end;
                res.push(newSelector);
            }
        }
        // get all tokens until closed
        s.run((token, selectors) => {
            var _a, _b;
            if (token.type === ')') {
                const currentSelector = (0, core_1.last)(selectors);
                if (currentSelector) {
                    currentSelector.end =
                        (_b = (_a = (0, core_1.last)(currentSelector.nodes)) === null || _a === void 0 ? void 0 : _a.end) !== null && _b !== void 0 ? _b : currentSelector.start;
                }
                return false;
            }
            return handleToken(token, selectors, source, s);
        }, res, source);
        const ended = s.peek(0);
        if (!prev ||
            'nodes' in prev ||
            prev.type === 'invalid' ||
            prev.type === 'combinator' ||
            prev.type === 'comment' ||
            prev.type === 'nth_step' ||
            prev.type === 'nth_dash' ||
            prev.type === 'nth_offset' ||
            prev.type === 'nth_of' ||
            ended.type !== ')') {
            ast.push({
                type: 'invalid',
                value: (0, core_1.getText)([token, ended], undefined, undefined, source),
                start: token.start,
                end: (_s = ended === null || ended === void 0 ? void 0 : ended.end) !== null && _s !== void 0 ? _s : s.peekBack().end,
            });
        }
        else {
            const lastSelector = (0, core_1.last)(res);
            if (lastSelector) {
                (0, helpers_1.trimCombinators)(lastSelector);
            }
            prev.nodes = res;
            prev.end = ended.end;
        }
    }
    else if ((0, core_1.isComment)(token.type)) {
        ast.push((0, helpers_1.createCommentAst)(token));
    }
    else if (token.type === ',') {
        // we ensure at least one selector present
        const selector = (0, core_1.last)(selectors);
        selector.end = token.start;
        (0, helpers_1.trimCombinators)(selector);
        const newSelector = (0, helpers_1.createEmptySelector)();
        if (s.done()) {
            newSelector.start = token.end;
            newSelector.end = token.end;
        }
        else {
            newSelector.start = s.peek().start;
        }
        selectors.push(newSelector);
    }
    else if (token.type === '&') {
        ast.push({
            type: 'nesting',
            value: '&',
            start: token.start,
            end: token.end,
        });
    }
    else {
        ast.push({
            type: 'invalid',
            value: token.value,
            start: token.start,
            end: token.end,
        });
    }
    if (s.done()) {
        currentSelector.end = (_u = (_t = (0, core_1.last)(currentSelector.nodes)) === null || _t === void 0 ? void 0 : _t.end) !== null && _u !== void 0 ? _u : currentSelector.start;
        (0, helpers_1.trimCombinators)(currentSelector);
    }
}
//# sourceMappingURL=selector-parser.js.map

/***/ }),

/***/ 380:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringifySelectorAst = void 0;
const nth_parser_1 = __webpack_require__(780);
function stringifySelectorAst(value) {
    return 'length' in value ? stringifySelectors(value) : stringifyNode(value);
}
exports.stringifySelectorAst = stringifySelectorAst;
const printers = {
    id: (node) => `#${node.value}${stringifyNested(node)}`,
    class: (node) => `.${node.dotComments.map(stringifyNode).join('')}${node.value}${stringifyNested(node)}`,
    type: (node) => `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
    combinator: (node) => `${node.before}${node.value}${node.after}`,
    attribute: (node) => `[${node.value}]${stringifyNested(node)}`,
    pseudo_class: (node) => `:${node.colonComments.map(stringifyNode).join('')}${node.value}${stringifyNested(node)}`,
    pseudo_element: (node) => `:${node.colonComments.first.map(stringifyNode).join('')}:${node.colonComments.second
        .map(stringifyNode)
        .join('')}${node.value}${stringifyNested(node)}`,
    comment: ({ before, value, after }) => `${before}${value}${after}`,
    universal: (node) => `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
    nesting: (node) => `${node.value}${stringifyNested(node)}`,
    selector: (node) => `${node.before}${node.nodes.map(stringifyNode).join('')}${node.after}`,
    compound_selector: (node) => `${node.before}${node.nodes.map(stringifyNode).join('')}${node.after}`,
    invalid: (node) => node.value,
    nth: (node) => `${node.before}${node.nodes.map(stringifyNode).join('')}${node.after}`,
    nth_step: ({ before, value, after }) => `${before}${value}${after}`,
    nth_dash: ({ before, value, after }) => `${before}${value}${after}`,
    nth_offset: ({ before, value, after }) => `${before}${value}${after}`,
    nth_of: ({ before, value, after }) => `${before}${value}${after}`,
};
function stringifyNode(node) {
    var _a, _b;
    return (_b = (_a = printers[node.type]) === null || _a === void 0 ? void 0 : _a.call(printers, node)) !== null && _b !== void 0 ? _b : '';
}
function stringifySelectors(selectors) {
    const result = [];
    for (const node of selectors) {
        result.push(stringifyNode(node));
    }
    return result.join(`,`);
}
function stringifyNested(node) {
    var _a;
    if ('nodes' in node) {
        if ((_a = node.nodes) === null || _a === void 0 ? void 0 : _a.length) {
            if (node.type === `pseudo_class` && nth_parser_1.NthParser.isNthPseudoClass(node.value)) {
                const [nthNode, ...selectors] = node.nodes;
                return `(${stringifyNode(nthNode)}${stringifySelectors(selectors)})`;
            }
            else {
                return `(${stringifySelectors(node.nodes)})`;
            }
        }
        else {
            return `()`;
        }
    }
    return '';
}
function stringifyNamespace({ namespace }) {
    let ns = ``;
    if (namespace) {
        ns += namespace.value;
        for (const comment of namespace.beforeComments) {
            ns += printers.comment(comment);
        }
        ns += `|`;
        for (const comment of namespace.afterComments) {
            ns += printers.comment(comment);
        }
    }
    return ns;
}
//# sourceMappingURL=stringify.js.map

/***/ }),

/***/ 467:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tokenizeSelector = void 0;
const core_1 = __webpack_require__(461);
function tokenizeSelector(source, options = {}) {
    const parseLineComments = false; // why would that be a choice?
    return (0, core_1.tokenize)(source, {
        isDelimiter,
        isStringDelimiter(char, previousChar) {
            return previousChar !== `\\` && (0, core_1.isStringDelimiter)(char);
        },
        isWhitespace: core_1.isWhitespace,
        shouldAddToken: () => true,
        createToken: core_1.createToken,
        getCommentStartType: parseLineComments
            ? core_1.getJSCommentStartType
            : core_1.getMultilineCommentStartType,
        isCommentEnd: core_1.isCommentEnd,
        getUnclosedComment: core_1.getUnclosedComment,
        offset: options.offset,
    });
}
exports.tokenizeSelector = tokenizeSelector;
const isDelimiter = (char, previousChar) => previousChar !== '\\' &&
    (char === '[' ||
        char === ']' ||
        char === '(' ||
        char === ')' ||
        char === ',' ||
        char === '*' ||
        char === '|' ||
        char === ':' ||
        char === '.' ||
        char === '#' ||
        char === '>' ||
        char === '~' ||
        char === '+' ||
        char === '{' ||
        char === '}' ||
        char === '&');
//# sourceMappingURL=tokenizer.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "App": () => (/* reexport */ App)
});

// EXTERNAL MODULE: ./node_modules/@tokey/css-selector-parser/dist/index.js
var dist = __webpack_require__(774);
;// CONCATENATED MODULE: ./src/translate/helpers/string-manipulation.ts
function joiner(items, options = { not: false }) {
    const joinWord = options.not ? 'or' : 'and';
    if (items.length === 2) {
        return `${items[0]} ${joinWord} ${items[1]}`;
    }
    if (items.length > 2) {
        return `${items.slice(0, -1).join(', ')} ${joinWord} ${items.at(-1)}`;
    }
    return items[0];
}

;// CONCATENATED MODULE: ./src/translate/helpers/pseudo-classes.ts

function parseStep(stepString) {
    const stepSign = stepString.includes('-') ? -1 : 1;
    return (Number(stepString.toLowerCase().replace('n', '').replace('-', '')) || 1) * stepSign;
}
const PSEUDO_CLASS_STATE = {
    hover: { state: 'hovered', text: '' },
    active: { state: 'active', text: 'Click on me!' },
    focus: { state: 'focused', text: 'Use with input / textarea' },
    visited: { state: 'visited', text: 'A link that was already clicked' },
    empty: { state: 'empty', text: '' },
    blank: { state: 'blank', text: '' },
    target: { state: 'targeted', text: '' },
    checked: { state: 'checked', text: '' },
    indeterminate: { state: 'indeterminate', text: '' },
    disabled: { state: 'disabled', text: '' },
    optional: { state: 'optional', text: 'Not required' },
    valid: { state: 'valid', text: 'Input value' },
    invalid: { state: 'invalid', text: '' },
    required: { state: 'required', text: '', attribute: 'required' },
    'read-only': { state: 'read-only', text: '', attribute: 'readonly' },
    'read-write': { state: 'read-write', text: 'Without readonly attribute' },
    'in-range': { state: 'in-range', text: '' },
    'out-of-range': { state: 'out-of-range', text: '' },
    lang: { state: 'language', text: '' },
    'last-child': { state: 'the last child of its parent', text: '' },
    'first-child': { state: 'the first child of its parent', text: '' },
    'only-child': { state: 'the only child of its parent', text: '' },
    'last-of-type': { state: 'the last child of its type in its parent', text: '' },
    'first-of-type': { state: 'the first child of its type in its parent', text: '' },
    'only-of-type': { state: 'the only of its type in its parent', text: '' },
    'nth-child': { state: 'child of its parent', text: '' },
    'nth-last-child': { state: 'child from the end of its parent', text: '' },
    'nth-of-type': { state: 'child of its type in his parent', text: '' },
    'nth-last-of-type': { state: 'child of its type from the end in his parent', text: '' },
    not: { state: 'not', text: '' },
};
const PSEUDO_CLASS_ATTRIBUTES = {
    'read-only': 'readonly',
};
function pseudoClassDescriptor({ name, value }) {
    if (name === 'not') {
        return `${PSEUDO_CLASS_STATE[name].state} ${value}`;
    }
    // language is en
    return `${PSEUDO_CLASS_STATE[name].state} is '${value}'`;
}
function offsetDescriptor(value) {
    return `the ${value}${getNumberSuffix(value)}`;
}
function stepDescriptor(stepString) {
    if (['odd', 'even'].includes(stepString)) {
        return `every ${stepString}`;
    }
    const step = parseStep(stepString);
    const stepDescriptor = step === -1 || step === 1 ? '' : ` ${Math.abs(step)}${getNumberSuffix(step)}`;
    return `every${stepDescriptor}`;
}
function nthAndStepDescriptor({ offset, step: stepString, name }) {
    const step = parseStep(stepString);
    const stepText = stepDescriptor(stepString);
    const offsetText = `${offset}${getNumberSuffix(offset)}`;
    const type = name.includes('child') ? 'child' : 'child of type';
    const directionText = step < 0 && name.includes('last') ? '' : step < 0 || name.includes('last') ? ', going down' : '';
    if (offset) {
        return `${stepText} ${type} starting with the ${offsetText} ${PSEUDO_CLASS_STATE[name].state} (inclusive)${directionText}`;
    }
    const nonShown = step < 0 ? ' (non shown because selection starts at 0, going down)' : '';
    return `${stepText} ${PSEUDO_CLASS_STATE[name].state}${directionText}${nonShown}`;
}
function getPseudoClassesString(pseudoClasses) {
    const state = pseudoClasses.map(({ name, value, offset, step }) => {
        if (offset || step) {
            return handleFormulas({ offset, step, name });
        }
        if (value && PSEUDO_CLASS_STATE[name]) {
            return pseudoClassDescriptor({ name, value });
        }
        if (PSEUDO_CLASS_STATE[name]) {
            return PSEUDO_CLASS_STATE[name].state;
        }
        return `'${name}' (unknown pseudo class)`;
    });
    if (state.length > 1) {
        return joiner(state);
    }
    return state[0];
}
function handleFormulas({ offset, step, name }) {
    const { state } = PSEUDO_CLASS_STATE[name];
    if (offset && !step) {
        return `${offsetDescriptor(Number(offset))} ${state}`;
    }
    if (step) {
        return nthAndStepDescriptor({ offset: Number(offset), step, name });
    }
    throw new Error('Invalid pseudo class');
}
function parsePseudoClassNode(value, secondLevelNodes) {
    if (secondLevelNodes[0].type === 'type') {
        /** lang pseudo class */
        return {
            parsedPseudoClass: {
                name: value,
                value: secondLevelNodes[0].value,
                offset: undefined,
                step: undefined,
            },
        };
    }
    else {
        const formula = { offset: '', step: '' };
        let dash = '';
        for (const node of secondLevelNodes) {
            if (node.type === 'nth_offset') {
                if (dash) {
                    formula.offset = dash + node.value;
                    dash = '';
                }
                else {
                    formula.offset = node.value;
                }
            }
            else if (node.type === 'nth_step') {
                formula.step = node.value;
            }
            else if (node.type === 'nth_dash') {
                dash = node.value;
            }
        }
        return {
            parsedPseudoClass: Object.assign({ name: value }, formula),
        };
    }
}
function getNumberSuffix(n) {
    if (n > 3 && n < 21) {
        return 'th';
    }
    const asString = n.toString();
    if (asString.at(-1) === '1') {
        return 'st';
    }
    if (asString.at(-1) === '2') {
        return 'nd';
    }
    if (asString.at(-1) === '3') {
        return 'rd';
    }
    return 'th';
}

;// CONCATENATED MODULE: ./src/ui/visualization/visualize.ts


function parseAttribute(attribute) {
    let [attr, value] = attribute.split('=');
    if (value) {
        if (value.endsWith(' i')) {
            value = value
                .slice(0, -2)
                .replaceAll('"', '')
                .split('')
                .map((char, i) => (i % 2 !== 0 ? char.toLowerCase() : char.toUpperCase()))
                .join('');
        }
        value = value[0] === '"' ? value.slice(1, -1) : value;
        const modifier = ['^', '$', '~', '*', '|'].includes(attr.at(-1)) ? attr.at(-1) : '';
        attr = modifier ? attr.slice(0, -1) : attr;
        return { attr, value, modifier };
    }
    return { attr, value };
}
function getAttribute(attribute) {
    const { attr, value, modifier } = parseAttribute(attribute);
    if (value) {
        if (modifier === '^') {
            return { attr, value: `${value}*` };
        }
        else if (modifier === '|') {
            return { attr, value: `*-${value}-*` };
        }
        else if (modifier === '~') {
            return { attr, value: `* ${value} *` };
        }
        else if (modifier === '*') {
            return { attr, value: `*${value}*` };
        }
        else if (modifier === '$') {
            return { attr, value: `*${value}` };
        }
        else {
            return { attr, value: value };
        }
    }
    return { attr, value: '' };
}
const getLastIndex = (arr) => arr.length - 1;
let currentElement;
let siblingArrayRef;
const baseElement = { tag: 'div' };
function visualize(selector) {
    var _a;
    const [selectorList] = (0,dist.parseCssSelector)(selector); // first selector, before the ','
    const elements = [Object.assign({}, baseElement)];
    siblingArrayRef = elements;
    currentElement = elements[0];
    let duplicateNext = false;
    let duplicateAsSibling = false;
    let adjacentCount = selector.split('+').length - 1;
    for (const selector of selectorList.nodes) {
        if (selector.type === 'type') {
            // Tag
            Object.assign(currentElement, { tag: selector.value });
        }
        else if (selector.type === 'class') {
            currentElement.classes = [...new Set([...((_a = currentElement.classes) !== null && _a !== void 0 ? _a : []), selector.value])];
        }
        else if (selector.type === 'id') {
            Object.assign(currentElement, { id: selector.value });
        }
        else if (selector.type === 'attribute') {
            // tags[tags.length - 1] = appendAttribute(selector.value, tags.at(-1));
            const { attr, value } = getAttribute(selector.value);
            addAttributes([[attr, value]]);
        }
        else if (selector.type === 'pseudo_element') {
            if (selector.value === 'first-line') {
                addChild(currentElement, {
                    tag: 'div',
                    innerText: 'First line',
                    attributes: { data: 'first-child' },
                    hideTag: true,
                });
                addChild(currentElement, { tag: 'div', innerText: 'Second line', hideTag: true });
                addSibling(currentElement, {
                    tag: currentElement.tag,
                    innerText: `</${currentElement.tag}>`,
                    hideTag: true,
                }, { adjacent: true });
            }
            if (selector.value === 'first-letter') {
                addChild(currentElement, {
                    tag: 'div',
                    innerText: 'First letter only',
                    attributes: { data: 'first-letter' },
                    hideTag: true,
                });
                addSibling(currentElement, {
                    tag: currentElement.tag,
                    innerText: `</${currentElement.tag}>`,
                    hideTag: true,
                }, { adjacent: true });
            }
        }
        else if (selector.type === 'pseudo_class') {
            const value = selector.value;
            let mainText = '';
            if (hasInnerNodes(selector)) {
                const { parsedPseudoClass } = parsePseudoClassNode(selector.value, selector.nodes[0].nodes);
                if (parsedPseudoClass.name === 'lang') {
                    mainText = `${PSEUDO_CLASS_STATE[parsedPseudoClass.name].state} is '${parsedPseudoClass.value}'`;
                    addAttributes([[parsedPseudoClass.name, parsedPseudoClass.value]]);
                }
                else if (parsedPseudoClass.offset && !parsedPseudoClass.step) {
                    const offset = Number(parsedPseudoClass.offset);
                    appendMultipleSiblings(offset);
                    moveRefToSiblingByIndex(offset - 1); // 1 based
                }
                else if (parsedPseudoClass.offset && parsedPseudoClass.step) {
                    const offset = Math.abs(Number(parsedPseudoClass.offset));
                    appendMultipleSiblings(offset * 2);
                    moveRefToSiblingByIndex(offset - 1); // 1 based
                }
                else if (!parsedPseudoClass.offset && parsedPseudoClass.step) {
                    if (['odd', 'even'].includes(parsedPseudoClass.step)) {
                        appendMultipleSiblings(4);
                        moveRefToSiblingByIndex(parsedPseudoClass.step === 'even' ? 3 : 4); // last even sibling
                    }
                    else {
                        const step = Math.abs(parseStep(parsedPseudoClass.step));
                        appendMultipleSiblings(step * 2, { moveRefToLast: true });
                    }
                }
            }
            else if (['disabled', 'required', 'read-only'].includes(value)) {
                const attrName = getAttributeName(value);
                addAttributes([[attrName, 'true']]);
                mainText = value;
            }
            else if (value === 'invalid') {
                addAttributes([['type', 'email']]);
                mainText = value;
            }
            else if (value === 'in-range' || value === 'out-of-range') {
                addAttributes([
                    ['min', '5'],
                    ['max', '10'],
                ]);
                mainText = value;
            }
            else {
                mainText = PSEUDO_CLASS_STATE[value].state;
            }
            const extraText = PSEUDO_CLASS_STATE[value].text ? ` (${PSEUDO_CLASS_STATE[value].text})` : '';
            if (mainText) {
                appendInnerText(mainText, extraText, currentElement);
            }
            if (value === 'last-child' || value === 'last-of-type') {
                duplicateElementAsSibling(currentElement, { moveRef: true });
            }
            if (value === 'first-child' || value === 'first-of-type') {
                duplicateElementAsSibling(currentElement, { moveRef: false });
            }
        }
        else if (selector.type === 'combinator') {
            const [combinator] = selector.value;
            if (combinator === ' ') {
                // Child combinators
                addChild(currentElement, baseElement, { moveSiblingsRef: true, moveRefToChild: true });
            }
            else if (combinator === '>') {
                addChild(currentElement, baseElement, { moveSiblingsRef: true, moveRefToChild: true });
                duplicateNext = true;
                continue;
            }
            else if (combinator === '+') {
                adjacentCount--;
                siblingArrayRef.push(Object.assign({}, baseElement));
                moveRefToSiblingByIndex(-1);
                if (adjacentCount === 0) {
                    // Only last element of adjacent combinator will be duplicated
                    duplicateAsSibling = true;
                }
            }
            else if (combinator === '~') {
                addSibling(currentElement, baseElement, { moveRef: true });
            }
        }
        else if (selector.type === 'universal') {
            // not moving the reference allow adding children to adjacent elements
            addSibling(currentElement, Object.assign(Object.assign({}, baseElement), { tag: 'span' }));
            addSibling(currentElement, Object.assign(Object.assign({}, baseElement), { tag: 'a' }));
        }
        if (duplicateNext) {
            addChild(currentElement, currentElement);
            duplicateNext = false;
        }
        if (duplicateAsSibling) {
            siblingArrayRef.push(currentElement);
            duplicateAsSibling = false;
        }
    }
    return elements;
}
function hasInnerNodes(selector) {
    return selector.nodes && selector.nodes[0].nodes;
}
function appendMultipleSiblings(amount, options = {}) {
    for (let index = 0; index < amount; index++) {
        duplicateElementAsSibling(currentElement, { moveRef: false });
    }
    if (options.moveRefToLast) {
        currentElement = siblingArrayRef[siblingArrayRef.length - 1];
    }
}
function duplicateElementAsSibling(element, options = {}) {
    const newSibling = Object.assign({}, element);
    siblingArrayRef.push(newSibling);
    if (options.moveRef) {
        currentElement = newSibling;
    }
}
function addChild(parent, child = baseElement, options = {}) {
    const newChild = Object.assign({}, child);
    if (!parent.children) {
        parent.children = [];
    }
    parent.children.push(Object.assign({}, newChild));
    if (options.moveSiblingsRef) {
        siblingArrayRef = parent.children;
    }
    if (options.moveRefToChild) {
        currentElement = parent.children.at(-1);
    }
}
function addSibling(element, sibling = baseElement, options = {}) {
    const lastIndex = getLastIndex(siblingArrayRef);
    if (options.adjacent) {
        const currentElementIndex = siblingArrayRef.indexOf(element);
        siblingArrayRef.splice(currentElementIndex + 1, 0, Object.assign({}, sibling));
    }
    else {
        siblingArrayRef.push(Object.assign({}, sibling));
    }
    if (options.moveRef) {
        currentElement = siblingArrayRef.at(lastIndex + 1);
    }
}
function moveRefToSiblingByIndex(index) {
    if (index === -1) {
        currentElement = siblingArrayRef[getLastIndex(siblingArrayRef)];
        return;
    }
    currentElement = siblingArrayRef[index];
}
function addAttributes(keyValues) {
    if (!currentElement.attributes) {
        currentElement.attributes = {};
    }
    for (const [key, value] of keyValues) {
        currentElement.attributes[key] = value;
    }
}
function getAttributeName(value) {
    if (Object.keys(PSEUDO_CLASS_ATTRIBUTES).includes(value)) {
        return PSEUDO_CLASS_ATTRIBUTES[value];
    }
    return value;
}
function appendInnerText(mainText, secondaryText, currentElement) {
    const text = `${mainText}${secondaryText}`;
    if (currentElement.innerText) {
        currentElement.innerText += ` and ${text}`;
    }
    else {
        currentElement.innerText = `When its ${text}`;
    }
}

;// CONCATENATED MODULE: ./src/translate/helpers/parse-attribute.ts
const EXIST = 'exist';
const ERROR = 'error';
const FULL = 'full';
const EQUAL = 'equal';
const EMPTY = 'empty';
function parse_attribute_parseAttribute(unparsedAttribute) {
    if (unparsedAttribute.trim() === '') {
        return { type: ERROR, error: `Empty attribute selector: '[${unparsedAttribute}]'` };
    }
    const splitterLocation = unparsedAttribute.indexOf('=');
    if (splitterLocation === -1) {
        return { type: EXIST, action: EXIST, name: unparsedAttribute };
    }
    const firstPart = unparsedAttribute.slice(0, splitterLocation);
    const secondPart = unparsedAttribute.slice(splitterLocation + 1);
    const { value, casing } = getValue(secondPart);
    if (firstPart.length === 0 || !value || secondPart.endsWith(':')) {
        return { type: ERROR, error: `Invalid attribute selector: '[${unparsedAttribute}]'` };
    }
    if (!isNaN(Number(secondPart))) {
        return { type: ERROR, error: `Numeric attribute value which is not wrapped in double quotes - ${secondPart}` };
    }
    const modifier = firstPart.at(-1);
    const { action, descriptor } = getModifierType(modifier);
    const name = action === EQUAL ? firstPart : firstPart.slice(0, -1);
    return { type: FULL, action, name, value, casing, descriptor };
}
function getValue(valueAndCasing) {
    if (valueAndCasing.startsWith('"')) {
        const [_, value, casing] = valueAndCasing.split('"');
        return { value: value || EMPTY, casing: !!casing };
    }
    const [value, casing] = valueAndCasing.split(' ');
    return { value, casing: !!casing };
}
function getModifierType(modifier) {
    if (modifier === '^')
        return { action: 'start', descriptor: (value) => `whose value starts with '${value}'` };
    if (modifier === '$')
        return {
            action: 'end',
            descriptor: (value) => `whose value ends with '${value}'`,
        };
    if (modifier === '|')
        return {
            action: 'hyphen-list',
            descriptor: (value) => `whose value '${value}' is included in a hyphen separated list`,
        };
    if (modifier === '~')
        return {
            action: 'space-list',
            descriptor: (value) => `whose value '${value}' is included in a space separated list`,
        };
    if (modifier === '*')
        return {
            action: 'contain',
            descriptor: (value) => `whose value contains '${value}'`,
        };
    return {
        action: EQUAL,
        descriptor: (value) => `whose value is ${value === EMPTY ? EMPTY : `'${value}'`}`,
    };
}

;// CONCATENATED MODULE: ./src/translate/helpers/pseudo-elements.ts
const PSEUDO_ELEMENTS_DESCRIPTORS = {
    before: `The 'before' pseudo-element of`,
    after: `The 'after' pseudo-element of`,
    'first-line': `The 'first line' of`,
    'first-letter': `The first letter of`,
    placeholder: `The placeholder of`,
    marker: `The marker (numbering) of`,
    backdrop: `The backdrop of`,
    selection: `The highlighted selection of`,
};
const isPseudoElement = (value) => Object.keys(PSEUDO_ELEMENTS_DESCRIPTORS).includes(value);

;// CONCATENATED MODULE: ./src/translate/constants.ts
const pseudoClassWithNodes = new Set([
    'nth-child',
    'nth-last-child',
    'nth-of-type',
    'nth-last-of-type',
    'lang',
    'not',
]);
const ERRORS = {
    TWO_IDS: 'An element cannot have two ids',
    EMPTY_CLASS: 'You specified an empty class',
    EMPTY_ID: 'You specified an empty id',
    EMPTY_PSEUDO_CLASS: 'You specified an empty pseudo class',
    PSEUDO_ELEMENT_AS_PSEUDO_CLASS: (el) => `You specified the pseudo element '${el}' as a pseudo class`,
    UNKNOWN_PSEUDO_ELEMENT: (el) => `Unknown pseudo element '${el}'`,
    MULTIPLE_PSEUDO_ELEMENT: `You cannot have multiple pseudo elements on a single selector`,
    EMPTY_PSEUDO_CLASS_NODE: 'You specified an empty pseudo class node',
    EXPECTED_PSEUDO_CLASS_NODE: `You specified a pseudo class which is expected to have a node (${[
        ...pseudoClassWithNodes,
    ].join(', ')})`,
    EMPTY_REQUIRED_NODE: 'You specified a pseudo class with an empty node',
    INCORRECT_PSEUDO_CLASS_NODE: (node) => `Incorrect pseudo class node was specified: '${node}'`,
    NTH_OF_NOT_SUPPORTED: 'Nth of syntax is not supported',
    NESTED_NOT_PSEUDO_CLASS: 'The pseudo class "not" cannot be nested',
    ABUSED_NOT_PSEUDO_CLASS: 'Having a universal selector within a not pseudo class is meaningless (select everything which is not everything)',
};

;// CONCATENATED MODULE: ./src/translate/iterate-compound-selector.ts






function iterateCompoundSelector(compoundSelector) {
    var _a;
    const result = {
        attributes: [],
        err: '',
        pseudoElement: undefined,
        classes: new Set(),
        pseudoClasses: [],
        element: '',
        id: '',
        hasUniversal: false,
    };
    for (const node of compoundSelector.nodes) {
        if (node.type === 'pseudo_element') {
            if (!isPseudoElement(node.value))
                result.err = ERRORS.UNKNOWN_PSEUDO_ELEMENT(node.value);
            else
                result.pseudoElement = node.value;
        }
        else if (node.type === 'class') {
            if (node.value === '')
                result.err = ERRORS.EMPTY_CLASS;
            else
                result.classes.add(node.value);
        }
        else if (node.type === 'type') {
            result.element = node.value;
        }
        else if (node.type === 'id') {
            if (result.id)
                result.err = ERRORS.TWO_IDS;
            else if (node.value === '')
                result.err = ERRORS.EMPTY_ID;
            else
                result.id = node.value;
        }
        else if (node.type === 'attribute') {
            const attr = parse_attribute_parseAttribute(node.value);
            if (attr.type === ERROR) {
                result.err = attr.error;
                break;
            }
            result.attributes.push(attr);
        }
        else if (node.type === 'universal') {
            result.hasUniversal = true;
        }
        else if (node.type === 'pseudo_class') {
            const { value, nodes } = node;
            if (!value) {
                result.err = ERRORS.EMPTY_PSEUDO_CLASS;
                break;
            }
            else if (pseudoClassWithNodes.has(value) && !nodes) {
                result.err = ERRORS.EXPECTED_PSEUDO_CLASS_NODE;
                break;
            }
            else if (pseudoClassWithNodes.has(value) && (nodes === null || nodes === void 0 ? void 0 : nodes.length) === 0) {
                result.err = ERRORS.EMPTY_REQUIRED_NODE;
                break;
            }
            else if (isPseudoElement(value)) {
                result.err = ERRORS.PSEUDO_ELEMENT_AS_PSEUDO_CLASS(value);
                break;
            }
            else if (value === 'not') {
                const innerNodes = nodes[0].nodes;
                if (innerNodes.length === 1 && innerNodes[0].type === 'universal') {
                    result.err = ERRORS.ABUSED_NOT_PSEUDO_CLASS;
                    break;
                }
                if (innerNodes.some((node) => node.type === 'pseudo_class' && node.value === 'not')) {
                    result.err = ERRORS.NESTED_NOT_PSEUDO_CLASS;
                    break;
                }
                const innerSelector = (0,dist.stringifySelectorAst)(nodes); // validated that nodes is not empty
                const { translation } = translate(innerSelector, { not: true });
                result.pseudoClasses.push({ name: value, value: translation.toLowerCase() });
            }
            else if ((nodes === null || nodes === void 0 ? void 0 : nodes.length) && nodes[0].nodes) {
                const innerNodes = nodes[0].nodes;
                if (innerNodes.some((node) => node.invalid === true)) {
                    result.err = ERRORS.INCORRECT_PSEUDO_CLASS_NODE((0,dist.stringifySelectorAst)(nodes));
                    break;
                }
                /** after invalid check, because (3 2n) is identified as nth_of */
                if (innerNodes.some((node) => node.type === 'nth_of')) {
                    result.err = ERRORS.NTH_OF_NOT_SUPPORTED;
                    break;
                }
                /** Check for lacking sign after spaces */
                if (((_a = innerNodes[0].after) === null || _a === void 0 ? void 0 : _a.includes(' ')) &&
                    !innerNodes[1].value.startsWith('+') &&
                    !innerNodes[1].value.startsWith('-')) {
                    result.err = ERRORS.INCORRECT_PSEUDO_CLASS_NODE((0,dist.stringifySelectorAst)(nodes));
                    break;
                }
                const { parsedPseudoClass } = parsePseudoClassNode(value, innerNodes);
                result.pseudoClasses.push(parsedPseudoClass);
            }
            else {
                result.pseudoClasses.push({ name: node.value });
            }
        }
    }
    return result;
}

;// CONCATENATED MODULE: ./src/translate/translate.ts







const capitalizeFirstLetter = (str) => ((str === null || str === void 0 ? void 0 : str.length) ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const addSingleQuotes = (items) => items.map((item) => `'${item}'`);
const getClassesString = (cls) => (cls.length > 1 ? `classes ${joiner(cls)}` : `a class of ${cls[0]}`);
function translate(selector, options = { not: false }) {
    const errors = [];
    const selectorList = (0,dist.parseCssSelector)(selector);
    const specificity = selectorList.map((selector) => `[${(0,dist.calcSpecificity)(selector).toString()}]`).join(', ');
    const compoundSelectorList = (0,dist.groupCompoundSelectors)(selectorList);
    const translations = [];
    let pseudoElementCount = 0;
    for (const topLevelSelectors of compoundSelectorList) {
        const translation = [];
        for (const selector of topLevelSelectors.nodes.reverse()) {
            if (selector.type === 'compound_selector') {
                const { classes, hasUniversal, element, id, attributes, pseudoClasses, pseudoElement, err } = iterateCompoundSelector(selector);
                if (err) {
                    errors.push(err);
                    break;
                }
                if (pseudoElement) {
                    pseudoElementCount++;
                    if (pseudoElementCount > 1) {
                        errors.push(ERRORS.MULTIPLE_PSEUDO_ELEMENT);
                    }
                    translation.push(PSEUDO_ELEMENTS_DESCRIPTORS[pseudoElement]);
                }
                if (element) {
                    isVowelPrefix(element) ? translation.push('an') : translation.push('a');
                    translation.push(`'<${element}>' element`);
                }
                else if (hasUniversal ||
                    (!element && topLevelSelectors.nodes.length === 1 && id.length + classes.size === 0)) {
                    translation.push('any element');
                }
                else if (!pseudoElement) {
                    translation.push('an element');
                }
                if (id.length) {
                    translation.push(`with the id of '${id}'`);
                }
                if (classes.size) {
                    translation.push(`with ${getClassesString(addSingleQuotes([...classes]))}`);
                }
                if (pseudoClasses.length) {
                    translation.push(`when its ${getPseudoClassesString(pseudoClasses)}`);
                }
                if (attributes.length) {
                    for (const attribute of attributes) {
                        const { type } = attribute;
                        if (type === EXIST) {
                            translation.push(`with an attribute of '${attribute.name}'`);
                        }
                        else if (type === FULL) {
                            const { value, descriptor, name, casing } = attribute;
                            translation.push(`with an attribute of '${name}'`);
                            if (descriptor)
                                translation.push(descriptor(value));
                            if (casing)
                                translation.push('(case insensitive)');
                        }
                    }
                }
            }
            if (selector.type === 'combinator') {
                if (['>', '+', '~'].includes(selector.value) && !translation.length) {
                    errors.push(`You Specified an empty combinator '${selector.value}'`);
                    break;
                }
                if (selector.value === '>')
                    translation.push('directly within');
                else if (selector.value === '+')
                    translation.push('directly adjacent sibling to');
                else if (selector.value === '~')
                    translation.push('after a sibling which is');
                else
                    translation.push('within');
            }
        }
        translations.push(translation.join(' '));
    }
    const translation = capitalizeFirstLetter(joiner(translations, options));
    return errors.length ? { translation: `Error: ${errors[0]}` } : { translation, specificity };
}
function isVowelPrefix(str) {
    if (['ul'].includes(str)) {
        return false;
    }
    return ['li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(str) || ['a', 'e', 'o', 'i', 'u'].includes(str[0]);
}

;// CONCATENATED MODULE: ./src/ui/visualization/create-element.ts
function createVisualizationElement(element) {
    const el = document.createElement(element.tag);
    if (element.classes)
        el.classList.add(...element.classes);
    if (element.id)
        el.id = element.id;
    addVisibleAttributes(element, el);
    const innerHTML = getInnerHtml(el, element);
    el.innerHTML = innerHTML;
    addHiddenAttributes(element, el, innerHTML);
    addVisibleAttributes(element, el); // visible attributes should override hidden ones
    if (element.children) {
        el.append(...element.children.map((child) => createVisualizationElement(child)));
    }
    return el;
}
const escapeChars = (str) => str.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const unescapeChars = (str) => str.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const getStartingTag = (el) => el.outerHTML.slice(0, el.outerHTML.indexOf('>') + 1);
const hasEndingTag = (el) => el.outerHTML.slice(-(el.tagName.length + 3)).includes(`/${el.tagName.toLowerCase()}`);
function getInnerHtml(el, element) {
    const { innerText, hideTag } = element;
    if (!hideTag) {
        const gotEndingTag = hasEndingTag(el);
        const startingTag = getStartingTag(el);
        const ending = gotEndingTag ? el.outerHTML.slice(-1 * (el.tagName.length + 3)) : el.outerHTML.slice(-1);
        const outerHtml = `${startingTag}${innerText && gotEndingTag ? innerText + ending : ''}`;
        return escapeChars(outerHtml);
    }
    return escapeChars(innerText !== null && innerText !== void 0 ? innerText : '');
}
/** This attributes will be presented to the user */
function addVisibleAttributes(element, el) {
    if (element.attributes) {
        for (const [key, value] of Object.entries(element.attributes)) {
            el.setAttribute(key, value);
        }
    }
}
//shortest: input:out-of-range
const countShortChars = (str) => { var _a; return ((_a = str.match(/(i|l|"|t|r|f)/g)) !== null && _a !== void 0 ? _a : []).length; };
const calculateLength = (str) => str.length - Math.ceil(countShortChars(str) / 3);
/** This attributes will be hidden from the user */
function addHiddenAttributes(element, el, innerHTML) {
    const { tag, innerText } = element;
    const unescaped = unescapeChars(innerHTML);
    if (tag === 'input') {
        // move inner text to value
        const escapedWithInnerText = innerText ? `${unescaped.slice(0, -1)} value="${innerText}">` : unescaped;
        el.innerText = '';
        el.setAttribute('type', 'text');
        el.setAttribute('value', escapedWithInnerText);
        el.setAttribute('size', `${calculateLength(escapedWithInnerText)}`);
    }
    if (tag === 'textarea') {
        el.setAttribute('cols', `${calculateLength(unescaped)}`);
        el.setAttribute('spellcheck', 'false');
    }
}
const replacements = {
    '::first-line': ' [data="first-child"]',
    '::first-letter': ' [data="first-letter"]::first-letter',
};
const findSelectorToReplace = (selector) => {
    for (const toReplace of Object.keys(replacements)) {
        if (selector.includes(toReplace)) {
            return toReplace;
        }
    }
};
function getVisualizationStyle(rootSelector, inputSelector) {
    const toBeReplaced = findSelectorToReplace(inputSelector);
    const selector = toBeReplaced ? inputSelector.replace(toBeReplaced, replacements[toBeReplaced]) : inputSelector;
    const after = inputSelector.includes('::after') ? 'after pseudo element' : '';
    const before = inputSelector.includes('::before') ? 'before pseudo element' : '';
    return `${rootSelector} ${selector} { 
        background-color: var(--primary);
        box-shadow: rgb(0 0 0 / 35%) 0px -50px 36px -28px inset;
        color: black;
        text-shadow: none;
        ${before || after ? `content: '${after}${before}';` : ''}
    }
    ${rootSelector} ${selector} * { 
        background-color: rgb(0 0 0 / 50%);
        color: white;
    }
    ${rootSelector} :not(${selector}){
        color: white;
        text-shadow: 0 0 5px black;
    }
    `.trim();
}

;// CONCATENATED MODULE: ./src/ui/ui.ts




const visualizationSelector = '#visualization';
class App {
    constructor() {
        this.input = document.querySelector('#selector-input');
        this.result = document.querySelector('#result');
        this.visualization = document.querySelector(visualizationSelector);
        this.visualizationStyle = document.querySelector('#visualization-style');
        this.specificityLink = document.querySelector('#specificity-link');
        this.specificityResult = document.querySelector('#specificity-result');
        this.previousInput = '';
        this.initiate = () => {
            const input = this.input.value.trim();
            if (input) {
                if (this.validateInput(input)) {
                    return;
                }
                this.translate(input);
                this.previousInput = input;
            }
            else {
                this.clear();
            }
        };
        this.validateInput = (input) => {
            return input === this.previousInput || input.endsWith(',');
        };
        this.visualize = (value) => {
            const visualization = visualize(value);
            const elements = [];
            for (const element of visualization) {
                const el = createVisualizationElement(element);
                elements.push(el);
            }
            this.visualization.append(...elements);
            this.visualizationStyle.innerHTML = getVisualizationStyle(visualizationSelector, value);
        };
        this.fillInputFromURL();
        this.input.addEventListener('input', this.initiate);
    }
    translate(value) {
        const { translation, specificity } = translate(value);
        const taggedTranslation = this.getTags(translation);
        this.result.innerHTML = taggedTranslation;
        if (specificity) {
            this.specificityLink.href = `https://polypane.app/css-specificity-calculator/#selector=${encodeURIComponent(value)}`;
            this.specificityLink.innerText = 'Specificity';
            this.specificityResult.innerText = `: ${specificity}`;
        }
        this.updateQueryParam(value);
        this.visualization.innerHTML = '';
        const unsupportedMessage = this.validateInputForVisualization(value, translation);
        if (unsupportedMessage) {
            this.visualization.innerHTML = unsupportedMessage;
        }
        else {
            this.visualize(value);
        }
    }
    validateInputForVisualization(value, translation) {
        if (translation.includes('Error')) {
            return 'No visualization due to selector input error';
        }
        if (translation.includes('unknown pseudo class')) {
            return 'No visualization due to unknown pseudo class';
        }
        if (translation.includes('<script>')) {
            return 'No visualization for script element';
        }
        if (value.includes(',')) {
            return 'Visualization not supported for multiple selectors';
        }
    }
    updateQueryParam(value) {
        const params = new URLSearchParams(window.location.search);
        if (!value) {
            params.delete('s');
        }
        else {
            params.set('s', encodeURIComponent(value));
        }
        history.pushState(null, '', '?' + params.toString());
    }
    clear() {
        this.input.value = '';
        this.result.innerText = '';
        this.visualizationStyle.innerHTML = '';
        this.visualization.innerHTML = '';
        this.previousInput = '';
        this.updateQueryParam('');
    }
    fillInputFromURL() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('s')) {
            const value = decodeURIComponent(params.get('s'));
            this.input.value = value;
            this.translate(value);
        }
    }
    getTags(value) {
        const tagged = [];
        const escaped = value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        for (const [index, part] of escaped.split("'").entries()) {
            tagged.push(index % 2 ? `<mark>${part}</mark>` : part);
        }
        return tagged.join('');
    }
}
window.App = new App();

;// CONCATENATED MODULE: ./src/index.ts


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});