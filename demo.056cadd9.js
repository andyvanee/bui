// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"uWh2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"2ytx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.insertBefore(start, before);
    start = n;
  }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"pnLb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"Av0K":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(element.content, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false); // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.

    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;

    while (partIndex < length) {
      const node = walker.nextNode();

      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      if (node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {
              length
            } = attributes; // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.

            let count = 0;

            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }

            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex]; // Find the attribute name

              const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.

              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
              partIndex += statics.length - 1;
            }
          }

          if (node.tagName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          const data = node.data;

          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];

              if (s === '') {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);

                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }

                insert = document.createTextNode(s);
              }

              parent.insertBefore(insert, node);
              this.parts.push({
                type: 'node',
                index: ++index
              });
            } // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.


            if (strings[lastIndex] === '') {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            } // We have a part for each match found


            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8
      /* Node.COMMENT_NODE */
      ) {
          if (node.data === marker) {
            const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part

            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }

            lastPartIndex = index;
            this.parts.push({
              type: 'node',
              index
            }); // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.

            if (node.nextSibling === null) {
              node.data = '';
            } else {
              nodesToRemove.push(node);
              index--;
            }

            partIndex++;
          } else {
            let i = -1;

            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({
                type: 'node',
                index: -1
              });
              partIndex++;
            }
          }
        }
    } // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"bn5t":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari dooes not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(fragment, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode(); // Loop through all the nodes and parts of a template

    while (partIndex < parts.length) {
      part = parts[partIndex];

      if (!(0, _template.isTemplatePartActive)(part)) {
        this.__parts.push(undefined);

        partIndex++;
        continue;
      } // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.


      while (nodeIndex < part.index) {
        nodeIndex++;

        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }

        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      } // We've arrived at our part's node.


      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);

        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }

      partIndex++;
    }

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"2ytx","./template.js":"Av0K"}],"cVNN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment poisition.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.

      const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.

      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceeding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.

      const attributeMatch = _template.lastAttributeNameRegex.exec(s);

      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceeding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
      }
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"2ytx","./template.js":"Av0K"}],"atl2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isIterable = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};

exports.isPrimitive = isPrimitive;

const isIterable = value => {
  return Array.isArray(value) || // tslint:disable-next-line:no-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attibute. The value is only set once even if there are multiple parts
 * for an attribute.
 */


exports.isIterable = isIterable;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
/**
 * A Part that controls all or part of an attribute value.
 */


exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */


exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part.__insert(this.startNode = (0, _template.createMarker)());

    part.__insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref.__insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    const value = this.__pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }

  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  __commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this.__insert(value);

    this.value = value;
  }

  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.

    const valueAsString = typeof value === 'string' ? value : String(value);

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }

    this.value = value;
  }

  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this.__commitNode(fragment);

      this.value = instance;
    }
  }

  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const value = !!this.__pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }

      this.value = value;
    }

    this.__pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    this.value = newListener;
    this.__pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"uWh2","./dom.js":"2ytx","./part.js":"pnLb","./template-instance.js":"bn5t","./template-result.js":"cVNN","./template.js":"Av0K"}],"52LB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const committer = new _parts.AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"atl2"}],"gbKZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"Av0K"}],"Fhpq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"2ytx","./parts.js":"atl2","./template-factory.js":"gbKZ"}],"SP/d":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isIterable", {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */

const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"52LB","./lib/template-result.js":"cVNN","./lib/directive.js":"uWh2","./lib/dom.js":"2ytx","./lib/part.js":"pnLb","./lib/parts.js":"atl2","./lib/render.js":"Fhpq","./lib/template-factory.js":"gbKZ","./lib/template-instance.js":"bn5t","./lib/template.js":"Av0K"}],"NXoq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodesFromTemplate = removeNodesFromTemplate;
exports.insertNodeIntoTemplate = insertNodeIntoTemplate;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module shady-render
 */
const walkerNodeFilter = 133
/* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */

function removeNodesFromTemplate(template, nodesToRemove) {
  const {
    element: {
      content
    },
    parts
  } = template;
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let part = parts[partIndex];
  let nodeIndex = -1;
  let removeCount = 0;
  const nodesToRemoveInTemplate = [];
  let currentRemovingNode = null;

  while (walker.nextNode()) {
    nodeIndex++;
    const node = walker.currentNode; // End removal if stepped past the removing node

    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    } // A node to remove was found in the template


    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node); // Track node we're removing

      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    } // When removing, increment count by which to adjust subsequent part indices


    if (currentRemovingNode !== null) {
      removeCount++;
    }

    while (part !== undefined && part.index === nodeIndex) {
      // If part is in a removed node deactivate it by setting index to -1 or
      // adjust the index as needed.
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      part = parts[partIndex];
    }
  }

  nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
}

const countNodes = node => {
  let count = node.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  ? 0 : 1;
  const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

  while (walker.nextNode()) {
    count++;
  }

  return count;
};

const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
  for (let i = startIndex + 1; i < parts.length; i++) {
    const part = parts[i];

    if ((0, _template.isTemplatePartActive)(part)) {
      return i;
    }
  }

  return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */


function insertNodeIntoTemplate(template, node, refNode = null) {
  const {
    element: {
      content
    },
    parts
  } = template; // If there's no refNode, then put node at end of template.
  // No part indices need to be shifted in this case.

  if (refNode === null || refNode === undefined) {
    content.appendChild(node);
    return;
  }

  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let insertCount = 0;
  let walkerIndex = -1;

  while (walker.nextNode()) {
    walkerIndex++;
    const walkerNode = walker.currentNode;

    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }

    while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
      // If we've inserted the node, simply adjust all subsequent parts
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }

        return;
      }

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
    }
  }
}
},{"./template.js":"Av0K"}],"eBH8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml.svg;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml.TemplateResult;
  }
});
exports.render = void 0;

var _dom = require("./dom.js");

var _modifyTemplate = require("./modify-template.js");

var _render = require("./render.js");

var _templateFactory = require("./template-factory.js");

var _templateInstance = require("./template-instance.js");

var _template = require("./template.js");

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Module to add shady DOM/shady CSS polyfill support to lit-html template
 * rendering. See the [[render]] method for details.
 *
 * @module shady-render
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

let compatibleShadyCSSVersion = true;

if (typeof window.ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
  console.warn(`Incompatible ShadyCSS version detected. ` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` + `@webcomponents/shadycss@1.3.1.`);
  compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */


const shadyTemplateFactory = scopeName => result => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);

  let templateCache = _templateFactory.templateCaches.get(cacheKey);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };

    _templateFactory.templateCaches.set(cacheKey, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  }

  const key = result.strings.join(_template.marker);
  template = templateCache.keyString.get(key);

  if (template === undefined) {
    const element = result.getTemplateElement();

    if (compatibleShadyCSSVersion) {
      window.ShadyCSS.prepareTemplateDom(element, scopeName);
    }

    template = new _template.Template(result, element);
    templateCache.keyString.set(key, template);
  }

  templateCache.stringsArray.set(result.strings, template);
  return template;
};

const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */

const removeStylesFromLitTemplates = scopeName => {
  TEMPLATE_TYPES.forEach(type => {
    const templates = _templateFactory.templateCaches.get(getTemplateCacheKey(type, scopeName));

    if (templates !== undefined) {
      templates.keyString.forEach(template => {
        const {
          element: {
            content
          }
        } = template; // IE 11 doesn't support the iterable param Set constructor

        const styles = new Set();
        Array.from(content.querySelectorAll('style')).forEach(s => {
          styles.add(s);
        });
        (0, _modifyTemplate.removeNodesFromTemplate)(template, styles);
      });
    }
  });
};

const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */

const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
  shadyRenderSet.add(scopeName); // If `renderedDOM` is stamped from a Template, then we need to edit that
  // Template's underlying template element. Otherwise, we create one here
  // to give to ShadyCSS, which still requires one while scoping.

  const templateElement = !!template ? template.element : document.createElement('template'); // Move styles out of rendered DOM and store.

  const styles = renderedDOM.querySelectorAll('style');
  const {
    length
  } = styles; // If there are no styles, skip unnecessary work

  if (length === 0) {
    // Ensure prepareTemplateStyles is called to support adding
    // styles via `prepareAdoptedCssText` since that requires that
    // `prepareTemplateStyles` is called.
    //
    // ShadyCSS will only update styles containing @apply in the template
    // given to `prepareTemplateStyles`. If no lit Template was given,
    // ShadyCSS will not be able to update uses of @apply in any relevant
    // template. However, this is not a problem because we only create the
    // template for the purpose of supporting `prepareAdoptedCssText`,
    // which doesn't support @apply at all.
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    return;
  }

  const condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
  // manipulations will not prevent us from being able to fix up template
  // part indices.
  // NOTE: collecting styles is inefficient for browsers but ShadyCSS
  // currently does this anyway. When it does not, this should be changed.

  for (let i = 0; i < length; i++) {
    const style = styles[i];
    style.parentNode.removeChild(style);
    condensedStyle.textContent += style.textContent;
  } // Remove styles from nested templates in this scope.


  removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
  // `template`.

  const content = templateElement.content;

  if (!!template) {
    (0, _modifyTemplate.insertNodeIntoTemplate)(template, condensedStyle, content.firstChild);
  } else {
    content.insertBefore(condensedStyle, content.firstChild);
  } // Note, it's important that ShadyCSS gets the template that `lit-html`
  // will actually render so that it can update the style inside when
  // needed (e.g. @apply native Shadow DOM case).


  window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
  const style = content.querySelector('style');

  if (window.ShadyCSS.nativeShadow && style !== null) {
    // When in native Shadow DOM, ensure the style created by ShadyCSS is
    // included in initially rendered output (`renderedDOM`).
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else if (!!template) {
    // When no style is left in the template, parts will be broken as a
    // result. To fix this, we put back the style node ShadyCSS removed
    // and then tell lit to remove that node from the template.
    // There can be no style in the template in 2 cases (1) when Shady DOM
    // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
    // is in use ShadyCSS removes the style if it contains no content.
    // NOTE, ShadyCSS creates its own style so we can safely add/remove
    // `condensedStyle` here.
    content.insertBefore(condensedStyle, content.firstChild);
    const removes = new Set();
    removes.add(condensedStyle);
    (0, _modifyTemplate.removeNodesFromTemplate)(template, removes);
  }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */


const render = (result, container, options) => {
  if (!options || typeof options !== 'object' || !options.scopeName) {
    throw new Error('The `scopeName` option is required.');
  }

  const scopeName = options.scopeName;

  const hasRendered = _render.parts.has(container);

  const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  && !!container.host; // Handle first render to a scope specially...

  const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
  // fragment that is reused since nested renders can occur synchronously.

  const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
  (0, _render.render)(result, renderContainer, Object.assign({
    templateFactory: shadyTemplateFactory(scopeName)
  }, options)); // When performing first scope render,
  // (1) We've rendered into a fragment so that there's a chance to
  // `prepareTemplateStyles` before sub-elements hit the DOM
  // (which might cause them to render based on a common pattern of
  // rendering in a custom element's `connectedCallback`);
  // (2) Scope the template with ShadyCSS one time only for this scope.
  // (3) Render the fragment into the container and make sure the
  // container knows its `part` is the one we just rendered. This ensures
  // DOM will be re-used on subsequent renders.

  if (firstScopeRender) {
    const part = _render.parts.get(renderContainer);

    _render.parts.delete(renderContainer); // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
    // that should apply to `renderContainer` even if the rendered value is
    // not a TemplateInstance. However, it will only insert scoped styles
    // into the document if `prepareTemplateStyles` has already been called
    // for the given scope name.


    const template = part.value instanceof _templateInstance.TemplateInstance ? part.value.template : undefined;
    prepareTemplateStyles(scopeName, renderContainer, template);
    (0, _dom.removeNodes)(container, container.firstChild);
    container.appendChild(renderContainer);

    _render.parts.set(container, part);
  } // After elements have hit the DOM, update styling if this is the
  // initial render to this container.
  // This is needed whenever dynamic changes are made so it would be
  // safest to do every render; however, this would regress performance
  // so we leave it up to the user to call `ShadyCSS.styleElement`
  // for dynamic changes.


  if (!hasRendered && needsScoping) {
    window.ShadyCSS.styleElement(container.host);
  }
};

exports.render = render;
},{"./dom.js":"2ytx","./modify-template.js":"NXoq","./render.js":"Fhpq","./template-factory.js":"gbKZ","./template-instance.js":"bn5t","./template.js":"Av0K","../lit-html.js":"SP/d"}],"fKvB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdatingElement = exports.notEqual = exports.defaultConverter = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */


window.JSCompiler_renameProperty = (prop, _obj) => prop;

const defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value ? '' : null;

      case Object:
      case Array:
        // if the value is `null` or `undefined` pass this through
        // to allow removing/no change behavior.
        return value == null ? value : JSON.stringify(value);
    }

    return value;
  },

  fromAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value !== null;

      case Number:
        return value === null ? null : Number(value);

      case Object:
      case Array:
        return JSON.parse(value);
    }

    return value;
  }

};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */

exports.defaultConverter = defaultConverter;

const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

exports.notEqual = notEqual;
const defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
const microtaskPromise = Promise.resolve(true);
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_HAS_CONNECTED = 1 << 5;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */

const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */

class UpdatingElement extends HTMLElement {
  constructor() {
    super();
    this._updateState = 0;
    this._instanceProperties = undefined;
    this._updatePromise = microtaskPromise;
    this._hasConnectedResolver = undefined;
    /**
     * Map with keys for any properties that have changed since the last
     * update cycle with previous values.
     */

    this._changedProperties = new Map();
    /**
     * Map with keys of properties that should be reflected when updated.
     */

    this._reflectingProperties = undefined;
    this.initialize();
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   */


  static get observedAttributes() {
    // note: piggy backing on this to ensure we're finalized.
    this.finalize();
    const attributes = []; // Use forEach so this works even if for/of loops are compiled to for loops
    // expecting arrays

    this._classProperties.forEach((v, p) => {
      const attr = this._attributeNameForProperty(p, v);

      if (attr !== undefined) {
        this._attributeToPropertyMap.set(attr, p);

        attributes.push(attr);
      }
    });

    return attributes;
  }
  /**
   * Ensures the private `_classProperties` property metadata is created.
   * In addition to `finalize` this is also called in `createProperty` to
   * ensure the `@property` decorator can add property metadata.
   */

  /** @nocollapse */


  static _ensureClassProperties() {
    // ensure private storage for property declarations.
    if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
      this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

      const superProperties = Object.getPrototypeOf(this)._classProperties;

      if (superProperties !== undefined) {
        superProperties.forEach((v, k) => this._classProperties.set(k, v));
      }
    }
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist.
   * The property setter calls the property's `hasChanged` property option
   * or uses a strict identity check to determine whether or not to request
   * an update.
   * @nocollapse
   */


  static createProperty(name, options = defaultPropertyDeclaration) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `finalize`, we ensure storage exists for property
    // metadata.
    this._ensureClassProperties();

    this._classProperties.set(name, options); // Do not generate an accessor if the prototype already has one, since
    // it would be lost otherwise and that would never be the user's intention;
    // Instead, we expect users to call `requestUpdate` themselves from
    // user-defined accessors. Note that if the super has an accessor we will
    // still overwrite it


    if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
      return;
    }

    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    Object.defineProperty(this.prototype, name, {
      // tslint:disable-next-line:no-any no symbol in index
      get() {
        return this[key];
      },

      set(value) {
        const oldValue = this[name];
        this[key] = value;

        this._requestUpdate(name, oldValue);
      },

      configurable: true,
      enumerable: true
    });
  }
  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   * @nocollapse
   */


  static finalize() {
    // finalize any superclasses
    const superCtor = Object.getPrototypeOf(this);

    if (!superCtor.hasOwnProperty(finalized)) {
      superCtor.finalize();
    }

    this[finalized] = true;

    this._ensureClassProperties(); // initialize Map populated in observedAttributes


    this._attributeToPropertyMap = new Map(); // make any properties
    // Note, only process "own" properties since this element will inherit
    // any properties defined on the superClass, and finalization ensures
    // the entire prototype chain is finalized.

    if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
      const props = this.properties; // support symbols in properties (IE11 does not support this)

      const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])]; // This for/of is ok because propKeys is an array

      for (const p of propKeys) {
        // note, use of `any` is due to TypeSript lack of support for symbol in
        // index types
        // tslint:disable-next-line:no-any no symbol in index
        this.createProperty(p, props[p]);
      }
    }
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */


  static _attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
  }
  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   * @nocollapse
   */


  static _valueHasChanged(value, old, hasChanged = notEqual) {
    return hasChanged(value, old);
  }
  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's
   * `converter` or `converter.fromAttribute` property option.
   * @nocollapse
   */


  static _propertyValueFromAttribute(value, options) {
    const type = options.type;
    const converter = options.converter || defaultConverter;
    const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
    return fromAttribute ? fromAttribute(value, type) : value;
  }
  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   * @nocollapse
   */


  static _propertyValueToAttribute(value, options) {
    if (options.reflect === undefined) {
      return;
    }

    const type = options.type;
    const converter = options.converter;
    const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
    return toAttribute(value, type);
  }
  /**
   * Performs element initialization. By default captures any pre-set values for
   * registered properties.
   */


  initialize() {
    this._saveInstanceProperties(); // ensures first update will be caught by an early access of
    // `updateComplete`


    this._requestUpdate();
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */


  _saveInstanceProperties() {
    // Use forEach so this works even if for/of loops are compiled to for loops
    // expecting arrays
    this.constructor._classProperties.forEach((_v, p) => {
      if (this.hasOwnProperty(p)) {
        const value = this[p];
        delete this[p];

        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }

        this._instanceProperties.set(p, value);
      }
    });
  }
  /**
   * Applies previously saved instance properties.
   */


  _applyInstanceProperties() {
    // Use forEach so this works even if for/of loops are compiled to for loops
    // expecting arrays
    // tslint:disable-next-line:no-any
    this._instanceProperties.forEach((v, p) => this[p] = v);

    this._instanceProperties = undefined;
  }

  connectedCallback() {
    this._updateState = this._updateState | STATE_HAS_CONNECTED; // Ensure first connection completes an update. Updates cannot complete
    // before connection and if one is pending connection the
    // `_hasConnectionResolver` will exist. If so, resolve it to complete the
    // update, otherwise requestUpdate.

    if (this._hasConnectedResolver) {
      this._hasConnectedResolver();

      this._hasConnectedResolver = undefined;
    }
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */


  disconnectedCallback() {}
  /**
   * Synchronizes property values when attributes change.
   */


  attributeChangedCallback(name, old, value) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }

  _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    const ctor = this.constructor;

    const attr = ctor._attributeNameForProperty(name, options);

    if (attr !== undefined) {
      const attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


      if (attrValue === undefined) {
        return;
      } // Track if the property is being reflected to avoid
      // setting the property again via `attributeChangedCallback`. Note:
      // 1. this takes advantage of the fact that the callback is synchronous.
      // 2. will behave incorrectly if multiple attributes are in the reaction
      // stack at time of calling. However, since we process attributes
      // in `update` this should not be possible (or an extreme corner case
      // that we'd like to discover).
      // mark state reflecting


      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      } // mark state not reflecting


      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
    }
  }

  _attributeToProperty(name, value) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
      return;
    }

    const ctor = this.constructor;

    const propName = ctor._attributeToPropertyMap.get(name);

    if (propName !== undefined) {
      const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration; // mark state reflecting

      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
      this[propName] = // tslint:disable-next-line:no-any
      ctor._propertyValueFromAttribute(value, options); // mark state not reflecting

      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    }
  }
  /**
   * This private version of `requestUpdate` does not access or return the
   * `updateComplete` promise. This promise can be overridden and is therefore
   * not free to access.
   */


  _requestUpdate(name, oldValue) {
    let shouldRequestUpdate = true; // If we have a property key, perform property update steps.

    if (name !== undefined) {
      const ctor = this.constructor;
      const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;

      if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
        if (!this._changedProperties.has(name)) {
          this._changedProperties.set(name, oldValue);
        } // Add to reflecting properties set.
        // Note, it's important that every change has a chance to add the
        // property to `_reflectingProperties`. This ensures setting
        // attribute + property reflects correctly.


        if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }

          this._reflectingProperties.set(name, options);
        }
      } else {
        // Abort the request if the property should not be considered changed.
        shouldRequestUpdate = false;
      }
    }

    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._enqueueUpdate();
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should
   * be called when an element should update based on some state not triggered
   * by setting a property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored. Returns the `updateComplete` Promise which is resolved
   * when the update completes.
   *
   * @param name {PropertyKey} (optional) name of requesting property
   * @param oldValue {any} (optional) old value of requesting property
   * @returns {Promise} A Promise that is resolved when the update completes.
   */


  requestUpdate(name, oldValue) {
    this._requestUpdate(name, oldValue);

    return this.updateComplete;
  }
  /**
   * Sets up the element to asynchronously update.
   */


  async _enqueueUpdate() {
    // Mark state updating...
    this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
    let resolve;
    let reject;
    const previousUpdatePromise = this._updatePromise;
    this._updatePromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    try {
      // Ensure any previous update has resolved before updating.
      // This `await` also ensures that property changes are batched.
      await previousUpdatePromise;
    } catch (e) {} // Ignore any previous errors. We only care that the previous cycle is
    // done. Any error should have been handled in the previous update.
    // Make sure the element has connected before updating.


    if (!this._hasConnected) {
      await new Promise(res => this._hasConnectedResolver = res);
    }

    try {
      const result = this.performUpdate(); // If `performUpdate` returns a Promise, we await it. This is done to
      // enable coordinating updates with a scheduler. Note, the result is
      // checked to avoid delaying an additional microtask unless we need to.

      if (result != null) {
        await result;
      }
    } catch (e) {
      reject(e);
    }

    resolve(!this._hasRequestedUpdate);
  }

  get _hasConnected() {
    return this._updateState & STATE_HAS_CONNECTED;
  }

  get _hasRequestedUpdate() {
    return this._updateState & STATE_UPDATE_REQUESTED;
  }

  get hasUpdated() {
    return this._updateState & STATE_HAS_UPDATED;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * You can override this method to change the timing of updates. If this
   * method is overridden, `super.performUpdate()` must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```
   * protected async performUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.performUpdate();
   * }
   * ```
   */


  performUpdate() {
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }

    let shouldUpdate = false;
    const changedProperties = this._changedProperties;

    try {
      shouldUpdate = this.shouldUpdate(changedProperties);

      if (shouldUpdate) {
        this.update(changedProperties);
      }
    } catch (e) {
      // Prevent `firstUpdated` and `updated` from running when there's an
      // update exception.
      shouldUpdate = false;
      throw e;
    } finally {
      // Ensure element can accept additional updates after an exception.
      this._markUpdated();
    }

    if (shouldUpdate) {
      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }

      this.updated(changedProperties);
    }
  }

  _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `_getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super._getUpdateComplete()`, then any subsequent state.
   *
   * @returns {Promise} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */


  get updateComplete() {
    return this._getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   *   class MyElement extends LitElement {
   *     async _getUpdateComplete() {
   *       await super._getUpdateComplete();
   *       await this._myChild.updateComplete;
   *     }
   *   }
   */


  _getUpdateComplete() {
    return this._updatePromise;
  }
  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  update(_changedProperties) {
    if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
      // Use forEach so this works even if for/of loops are compiled to for
      // loops expecting arrays
      this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));

      this._reflectingProperties = undefined;
    }
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  updated(_changedProperties) {}
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  firstUpdated(_changedProperties) {}

}

exports.UpdatingElement = UpdatingElement;
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */

UpdatingElement[_a] = true;
},{}],"4Fzp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.property = property;
exports.query = query;
exports.queryAll = queryAll;
exports.eventOptions = exports.customElement = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
  window.customElements.define(tagName, clazz); // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.
  // tslint:disable-next-line:no-any

  return clazz;
};

const standardCustomElement = (tagName, descriptor) => {
  const {
    kind,
    elements
  } = descriptor;
  return {
    kind,
    elements,

    // This callback is called once the class is otherwise fully defined
    finisher(clazz) {
      window.customElements.define(tagName, clazz);
    }

  };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * @param tagName the name of the custom element to define
 */


const customElement = tagName => classOrDescriptor => typeof classOrDescriptor === 'function' ? legacyCustomElement(tagName, classOrDescriptor) : standardCustomElement(tagName, classOrDescriptor);

exports.customElement = customElement;

const standardProperty = (options, element) => {
  // When decorating an accessor, pass it through and add property metadata.
  // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
  // stomp over the user's accessor.
  if (element.kind === 'method' && element.descriptor && !('value' in element.descriptor)) {
    return Object.assign({}, element, {
      finisher(clazz) {
        clazz.createProperty(element.key, options);
      }

    });
  } else {
    // createProperty() takes care of defining the property, but we still
    // must return some kind of descriptor, so return a descriptor for an
    // unused prototype field. The finisher calls createProperty().
    return {
      kind: 'field',
      key: Symbol(),
      placement: 'own',
      descriptor: {},

      // When @babel/plugin-proposal-decorators implements initializers,
      // do this instead of the initializer below. See:
      // https://github.com/babel/babel/issues/9260 extras: [
      //   {
      //     kind: 'initializer',
      //     placement: 'own',
      //     initializer: descriptor.initializer,
      //   }
      // ],
      initializer() {
        if (typeof element.initializer === 'function') {
          this[element.key] = element.initializer.call(this);
        }
      },

      finisher(clazz) {
        clazz.createProperty(element.key, options);
      }

    };
  }
};

const legacyProperty = (options, proto, name) => {
  proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 *
 * @ExportDecoratedItems
 */


function property(options) {
  // tslint:disable-next-line:no-any decorator
  return (protoOrDescriptor, name) => name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @ExportDecoratedItems
 */


function query(selector) {
  return (protoOrDescriptor, // tslint:disable-next-line:no-any decorator
  name) => {
    const descriptor = {
      get() {
        return this.renderRoot.querySelector(selector);
      },

      enumerable: true,
      configurable: true
    };
    return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
  };
}
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @ExportDecoratedItems
 */


function queryAll(selector) {
  return (protoOrDescriptor, // tslint:disable-next-line:no-any decorator
  name) => {
    const descriptor = {
      get() {
        return this.renderRoot.querySelectorAll(selector);
      },

      enumerable: true,
      configurable: true
    };
    return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
  };
}

const legacyQuery = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};

const standardQuery = (descriptor, element) => ({
  kind: 'method',
  placement: 'prototype',
  key: element.key,
  descriptor
});

const standardEventOptions = (options, element) => {
  return Object.assign({}, element, {
    finisher(clazz) {
      Object.assign(clazz.prototype[element.key], options);
    }

  });
};

const legacyEventOptions = // tslint:disable-next-line:no-any legacy decorator
(options, proto, name) => {
  Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifis event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 *
 *     class MyElement {
 *
 *       clicked = false;
 *
 *       render() {
 *         return html`<div @click=${this._onClick}`><button></button></div>`;
 *       }
 *
 *       @eventOptions({capture: true})
 *       _onClick(e) {
 *         this.clicked = true;
 *       }
 *     }
 */


const eventOptions = options => // Return value typed as any to prevent TypeScript from complaining that
// standard decorator function signature does not match TypeScript decorator
// signature
// TODO(kschaaf): unclear why it was only failing on this decorator and not
// the others
(protoOrDescriptor, name) => name !== undefined ? legacyEventOptions(options, protoOrDescriptor, name) : standardEventOptions(options, protoOrDescriptor);

exports.eventOptions = eventOptions;
},{}],"ZFCR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = exports.unsafeCSS = exports.CSSResult = exports.supportsAdoptingStyleSheets = void 0;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
exports.supportsAdoptingStyleSheets = supportsAdoptingStyleSheets;
const constructionToken = Symbol();

class CSSResult {
  constructor(cssText, safeToken) {
    if (safeToken !== constructionToken) {
      throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    }

    this.cssText = cssText;
  } // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.


  get styleSheet() {
    if (this._styleSheet === undefined) {
      // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
      // is constructable.
      if (supportsAdoptingStyleSheets) {
        this._styleSheet = new CSSStyleSheet();

        this._styleSheet.replaceSync(this.cssText);
      } else {
        this._styleSheet = null;
      }
    }

    return this._styleSheet;
  }

  toString() {
    return this.cssText;
  }

}
/**
 * Wrap a value for interpolation in a css tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */


exports.CSSResult = CSSResult;

const unsafeCSS = value => {
  return new CSSResult(String(value), constructionToken);
};

exports.unsafeCSS = unsafeCSS;

const textFromCSSResult = value => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else if (typeof value === 'number') {
    return value;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
  }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */


const css = (strings, ...values) => {
  const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, constructionToken);
};

exports.css = css;
},{}],"+bhx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LitElement: true,
  html: true,
  svg: true,
  TemplateResult: true,
  SVGTemplateResult: true
};
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml2.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml2.svg;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.TemplateResult;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.SVGTemplateResult;
  }
});
exports.LitElement = void 0;

var _litHtml = require("lit-html");

var _shadyRender = require("lit-html/lib/shady-render.js");

var _updatingElement = require("./lib/updating-element.js");

Object.keys(_updatingElement).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _updatingElement[key];
    }
  });
});

var _decorators = require("./lib/decorators.js");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _litHtml2 = require("lit-html/lit-html.js");

var _cssTag = require("./lib/css-tag.js");

Object.keys(_cssTag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cssTag[key];
    }
  });
});

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.2.1');
/**
 * Minimal implementation of Array.prototype.flat
 * @param arr the array to flatten
 * @param result the accumlated result
 */

function arrayFlat(styles, result = []) {
  for (let i = 0, length = styles.length; i < length; i++) {
    const value = styles[i];

    if (Array.isArray(value)) {
      arrayFlat(value, result);
    } else {
      result.push(value);
    }
  }

  return result;
}
/** Deeply flattens styles array. Uses native flat if available. */


const flattenStyles = styles => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);

class LitElement extends _updatingElement.UpdatingElement {
  /** @nocollapse */
  static finalize() {
    // The Closure JS Compiler does not always preserve the correct "this"
    // when calling static super methods (b/137460243), so explicitly bind.
    super.finalize.call(this); // Prepare styling that is stamped at first render time. Styling
    // is built from user provided `styles` or is inherited from the superclass.

    this._styles = this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ? this._getUniqueStyles() : this._styles || [];
  }
  /** @nocollapse */


  static _getUniqueStyles() {
    // Take care not to call `this.styles` multiple times since this generates
    // new CSSResults each time.
    // TODO(sorvell): Since we do not cache CSSResults by input, any
    // shared styles will generate new stylesheet objects, which is wasteful.
    // This should be addressed when a browser ships constructable
    // stylesheets.
    const userStyles = this.styles;
    const styles = [];

    if (Array.isArray(userStyles)) {
      const flatStyles = flattenStyles(userStyles); // As a performance optimization to avoid duplicated styling that can
      // occur especially when composing via subclassing, de-duplicate styles
      // preserving the last item in the list. The last item is kept to
      // try to preserve cascade order with the assumption that it's most
      // important that last added styles override previous styles.

      const styleSet = flatStyles.reduceRight((set, s) => {
        set.add(s); // on IE set.add does not return the set.

        return set;
      }, new Set()); // Array.from does not work on Set in IE

      styleSet.forEach(v => styles.unshift(v));
    } else if (userStyles) {
      styles.push(userStyles);
    }

    return styles;
  }
  /**
   * Performs element initialization. By default this calls `createRenderRoot`
   * to create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */


  initialize() {
    super.initialize();
    this.renderRoot = this.createRenderRoot(); // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
    // element's getRootNode(). While this could be done, we're choosing not to
    // support this now since it would require different logic around de-duping.

    if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
      this.adoptStyles();
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */


  createRenderRoot() {
    return this.attachShadow({
      mode: 'open'
    });
  }
  /**
   * Applies styling to the element shadowRoot using the `static get styles`
   * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
   * available and will fallback otherwise. When Shadow DOM is polyfilled,
   * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
   * is available but `adoptedStyleSheets` is not, styles are appended to the
   * end of the `shadowRoot` to [mimic spec
   * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
   */


  adoptStyles() {
    const styles = this.constructor._styles;

    if (styles.length === 0) {
      return;
    } // There are three separate cases here based on Shadow DOM support.
    // (1) shadowRoot polyfilled: use ShadyCSS
    // (2) shadowRoot.adoptedStyleSheets available: use it.
    // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
    // rendering


    if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
      window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
    } else if (_cssTag.supportsAdoptingStyleSheets) {
      this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
    } else {
      // This must be done after rendering so the actual style insertion is done
      // in `update`.
      this._needsShimAdoptedStyleSheets = true;
    }
  }

  connectedCallback() {
    super.connectedCallback(); // Note, first update/render handles styleElement so we only call this if
    // connected after first update.

    if (this.hasUpdated && window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this);
    }
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * * @param _changedProperties Map of changed properties with old values
   */


  update(changedProperties) {
    super.update(changedProperties);
    const templateResult = this.render();

    if (templateResult instanceof _litHtml.TemplateResult) {
      this.constructor.render(templateResult, this.renderRoot, {
        scopeName: this.localName,
        eventContext: this
      });
    } // When native Shadow DOM is used but adoptedStyles are not supported,
    // insert styling after rendering to ensure adoptedStyles have highest
    // priority.


    if (this._needsShimAdoptedStyleSheets) {
      this._needsShimAdoptedStyleSheets = false;

      this.constructor._styles.forEach(s => {
        const style = document.createElement('style');
        style.textContent = s.cssText;
        this.renderRoot.appendChild(style);
      });
    }
  }
  /**
   * Invoked on each update to perform rendering tasks. This method must return
   * a lit-html TemplateResult. Setting properties inside this method will *not*
   * trigger the element to update.
   */


  render() {}

}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */


exports.LitElement = LitElement;
LitElement['finalized'] = true;
/**
 * Render method used to render the lit-html TemplateResult to the element's
 * DOM.
 * @param {TemplateResult} Template to render.
 * @param {Element|DocumentFragment} Node into which to render.
 * @param {String} Element name.
 * @nocollapse
 */

LitElement.render = _shadyRender.render;
},{"lit-html":"SP/d","lit-html/lib/shady-render.js":"eBH8","./lib/updating-element.js":"fKvB","./lib/decorators.js":"4Fzp","lit-html/lit-html.js":"SP/d","./lib/css-tag.js":"ZFCR"}],"ncPe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconList = exports.IconElement = exports.svgIcons = void 0;

var _litElement = require("lit-element");

/*
	https://icomoon.io/app
*/
const svgDef = require('./icons.svg.html');

class SvgIcons {
  get prefix() {
    return 'icon-';
  }

  get svgDefElement() {
    if (!this.__svgDefElement) {
      let div = document.createElement('div');
      div.innerHTML = svgDef;
      this.__svgDefElement = div.firstChild; // remove all the <title> tags so they dont show as "tooltips" when hovering

      this.__svgDefElement.querySelectorAll('title').forEach(el => el.remove());

      div = null;
    }

    return this.__svgDefElement;
  }

  get names() {
    return Array.from(this.svgDefElement.querySelectorAll('symbol')).map(el => el.id.replace(this.prefix, '')).sort();
  }

  get(name) {
    let symbol = this.svgDefElement.querySelector(`#${this.prefix}${name}`);
    let svg = null;

    if (symbol) {
      let div = document.createElement('div');
      div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${symbol.innerHTML}</svg>`;
      svg = div.firstChild; // copy attributes

      Array.from(symbol.attributes).forEach(attr => {
        svg.setAttribute(attr.name, attr.value);
      });
    }

    return svg;
  }

}

const svgIcons = new SvgIcons();
exports.svgIcons = svgIcons;

class IconElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    temp.innerHTML = `<style>
		:host {
			display: inline-flex;
			vertical-align: middle;
			align-items: center;
			justify-content: center;
			color: inherit;
			--size: 1em;
			height: var(--size);
		}

		:host([square]) {
			width: var(--size);
		}

		:host([invalid]) {
			background: #f44336;
		}

		svg {
			height: 100%;
			/* width: 100%; */
			display: inline-block;
			fill: currentColor;
			color: currentColor;
		}
		</style>
		<slot></slot>
		`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
  }

  _setSVG() {
    if (this._svg) this._svg.remove();
    this._svg = svgIcons.get(this.name);

    if (this._svg) {
      this.removeAttribute('invalid');
      this.shadowRoot.appendChild(this._svg);
    } else {
      this.setAttribute('invalid', '');
    }
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name') this._setSVG();
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    return this.setAttribute('name', val);
  }

}

exports.IconElement = IconElement;
customElements.define('b-icon', IconElement);

class IconList extends _litElement.LitElement {
  static get properties() {
    return {
      cols: {
        type: Number,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.cols = 6;
  }

  static get styles() {
    return _litElement.css`
		:host {
			display: block;
			column-count: 6;
			gap: 1em;
			width: 100%;
			font-size:1.2em;
			padding: 1em;
			overflow: auto;
		}

		:host([cols="1"]) { column-count: 1}
		:host([cols="2"]) { column-count: 2}
		:host([cols="3"]) { column-count: 3}
		:host([cols="4"]) { column-count: 4}
		:host([cols="5"]) { column-count: 5}
		:host([cols="6"]) { column-count: 6}

		:host > div {
			margin: .75em;
		}

		:host > div:first-child {
			margin-top: 0;
		}

		b-icon {
			width: 1.6em;
		}

		small {
			color: rgba(0,0,0,.5);
		}

		@media (max-width: 550px) {
            :host {
                column-count: 1 !important;
            }
        }
	`;
  }

  render() {
    return _litElement.html`
		${svgIcons.names.map(name => _litElement.html`
			<div>
				<b-icon name=${name}></b-icon> <small>${name}</small>
			</div>
		`)}
	`;
  }

}

exports.IconList = IconList;
customElements.define('b-icon-list', IconList);
},{"lit-element":"+bhx","./icons.svg.html":"pxeq"}],"EnCN":[function(require,module,exports) {
/*
	SVG and idea taken from https://ant.design/components/button/
	
	Examples: 
	<circle-spinner/>
	<circle-spinner style="--size:.8em; color: white"/>
*/
class SpinnerElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    temp.innerHTML = `<style>
			:host {
				--size: .8em;
				height: var(--size);
			    width: var(--size);
			    display: inline-block;
			    vertical-align: middle;
			}
			
			:host(.overlay) {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 10000;
			}
			
			@keyframes spin {
				100% {
				    transform: rotate(360deg);
				}
			}
			
			svg {
				animation: spin 1s infinite linear;
				transform-origin: center center;
			}
			</style>
			<svg viewBox="0 0 1024 1024" class="spin" data-icon="loading" width="100%" height="100%" fill="currentColor" aria-hidden="true">
				<path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
			</svg>`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
  }

}

customElements.define('b-spinner', SpinnerElement);
},{}],"DABr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BtnElement = void 0;

var _litElement = require("lit-element");

require("./spinner");

require("./icon");

class BtnElement extends _litElement.LitElement {
  static get properties() {
    return {
      href: {
        type: String,
        reflect: true
      },
      value: {
        type: String,
        reflect: true
      },
      icon: {
        type: String
      },
      spin: {
        type: Boolean,
        reflect: true,
        attribute: 'spin'
      }
    };
  }

  static get styles() {
    return _litElement.css`
    
        :host{
            --black: #333;
            --orange: #F57C00;
            --blue: #2196F3;
            --red: #d32f2f;
            --gray: #444444;
            --green: #27ae60;
            --yellow: #f2d57e;
            --teal: #009688;
            --purple: #7E57C2;
            --brown: #795548;
            --pink: #E91E63;

            --radius: 3px;
            --color: var(--black);
            --bgdColor: var(--color);
            --hoverBgdColor: rgba(255,255,255,.1);
            --textColor: #fff;
            --borderColor: var(--color);
            --padding: .4em .6em;

            display: inline-block;
            position: relative;
            box-sizing: border-box;
            background: var(--bgdColor);
            color: var(--textColor);
            border-radius: var(--radius);
            cursor: pointer;
            transition: 160ms;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-size: .9rem;
            line-height: 1rem;
            font-weight: bold;
        }

        :host([hidden]) {
            display: none !important;
        }

        main {
            border-radius: var(--radius);
            position: relative;
            display: inline-flex;
            align-items: center;
            padding: var(--padding);
            /*padding-bottom: .3em;*/ /* remove descender line to make it look more centered*/
            text-overflow: ellipsis;
            border: solid 1px var(--borderColor);
            /* transition: 120ms; */
        }

        slot {
            display: block;
            margin-bottom: -.1em; /* remove descender line to make it look more centered*/
        }

        slot::slotted(*) {
            display: inline-block;
            margin-top: 0;
            margin-bottom: 0;
        }

        .hover {
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: var(--hoverBgdColor);
            visibility: hidden;
            opacity: 0;
            /* mix-blend-mode: saturation; */
            border-radius: var(--radius);
            /* transition: 120ms; */
        }

        @media (hover) {
            :host(:hover) .hover {
                opacity: 1;
                visibility: visible;
            }
        }

        /* b-icon,
        ::slotted(b-icon) {
            vertical-align: bottom;
        } */

        b-spinner {
            opacity: 0;
            visibility: hidden;
            --size: 1em;
            margin-left: -1.35em;
            margin-right: .35em;
            transition: 120ms;
        }

        :host([spin]) b-spinner {
            opacity: 1;
            visibility: visible;
            margin-left: 0;
        }

        :host([spin]) b-icon {
            display: none;
        }

        main > b-icon {
            margin-right: .35em;
            margin-left: -.15em;
        }

        :host([block]) {
            display: block;
            text-align: center
        }

        :host([block]) main {
            display: flex;
            justify-content: center
        }

        :host(:empty) main {
            --padding: .4em .5em;
        }

        :host(:empty) main > b-icon {
            margin-left: 0;
            margin-right: 0;
        }

        /* offset play icon to make it appear more centered */
        :host(:empty) main b-icon[name="play"] {
			margin: 0 -.1em 0 .1em;
        }

        :host([color^="primary"])  { --color: var(--primaryColor); }
        :host([color^="black"])  { --color: var(--black); }
        :host([color^="orange"]) { --color: var(--orange); }
        :host([color^="blue"])   { --color: var(--blue); }
        :host([color^="red"])    { --color: var(--red); }
        :host([color^="gray"])   { --color: var(--gray); }
        :host([color^="green"])  { --color: var(--green); }
        :host([color^="yellow"]) { --color: var(--yellow); }
        :host([color^="teal"])   { --color: var(--teal); }
        :host([color^="purple"]) { --color: var(--purple); }
        :host([color^="brown"])  { --color: var(--brown); }
        :host([color^="pink"])   { --color: var(--pink); }

        @media (hover){
        :host([color*="hover-black"]:hover)  { --color: var(--black); }
        :host([color*="hover-orange"]:hover) { --color: var(--orange); }
        :host([color*="hover-blue"]:hover)   { --color: var(--blue); }
        :host([color*="hover-red"]:hover)    { --color: var(--red); }
        :host([color*="hover-gray"]:hover)   { --color: var(--gray); }
        :host([color*="hover-green"]:hover)  { --color: var(--green); }
        :host([color*="hover-yellow"]:hover) { --color: var(--yellow); }
        :host([color*="hover-teal"]:hover)   { --color: var(--teal); }
        :host([color*="hover-purple"]:hover) { --color: var(--purple); }
        :host([color*="hover-brown"]:hover)  { --color: var(--brown); }
        :host([color*="hover-pink"]:hover)   { --color: var(--pink); }
        }

        :host([pill]) {
            --radius: 1em;
        }

        /* @media (hover) { */
        :host([outline]:not(:hover)) {
            --bgdColor: transparent;
            --textColor: var(--color);
        }
        /* } */

        /* :host([outline]:hover){
            --bgdColor: var(--color);
            --textColor: inherit;
        } */

        :host([text]),
        :host([clear]) {
            --bgdColor: transparent;
            --textColor: var(--color);
            --borderColor: transparent;
        }

        /* :host([text]) .hover,
        :host([clear]) .hover {
            display: none;
        } */

        :host([text]) {
            font-size: 1em;
            font-weight: normal;
        }

        @media (hover){
        :host([text]:hover),
        :host([clear]:hover) {
            --bgdColor: rgba(0,0,0,.05);
        }}

        :host([text].popover-open),
        :host([clear].popover-open) {
            --bgdColor: rgba(0,0,0,.05);
        }

        :host([xs]) { font-size: .6rem; }
        :host([sm]) { font-size: .8rem; }
        :host([lg]) { font-size: 1.2rem; }
        :host([xl]) { font-size: 1.4rem; }
    `;
  }

  render() {
    return _litElement.html`
        <div class="hover"></div>
        <main>
            <b-spinner></b-spinner>
            ${this.icon ? _litElement.html`<b-icon name="${this.icon}"></b-icon>` : ''}
            <slot></slot>
        </main>
    `;
  }

  constructor() {
    super();
    this.icon = '';
    this.spin = false;
  }

  firstUpdated() {
    this.addEventListener('click', () => {
      if (this.href) window.location = this.href;
    }, true);
  }

}

exports.BtnElement = BtnElement;
customElements.define('b-btn', BtnElement);
},{"lit-element":"+bhx","./spinner":"EnCN","./icon":"ncPe"}],"eyVY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpinnerOverlayElement = void 0;

var _litElement = require("lit-element");

require("./spinner");

class SpinnerOverlayElement extends _litElement.LitElement {
  static get properties() {
    return {
      show: {
        type: Boolean,
        reflect: true
      },
      label: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.show = false;
    this.label = '';
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.parentNode && this.parentNode.host && !this.parentNode.host.spinner) {
      this.host = this.parentNode.host;
      this.host.spinner = this;
    } else if (this.parentElement && !this.parentElement.spinner) {
      this.host = this.parentElement;
      this.host.spinner = this;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.host) delete this.host.spinner;
  }

  static get styles() {
    return _litElement.css`
		:host {
			--spinnerBgd: rgba(255,255,255 ,.6);
            --spinnerColor: inherit;
            --spinnerSize: 1.6em;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1200;
            background: var(--spinnerBgd);
            color: var(--spinnerColor);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            transition: 140ms opacity;
        }

		:host([dark]) {
			--spinnerBgd: rgba(0,0,0,.6);
			--spinnerColor: #fff;
		}

		main {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		label:not(:empty) {
			margin-left: 1em;
		}

		:host([lg]) {
			--spinnerSize: 6em;
		}

		:host([lg]) main {
			flex-direction: column;
		}

		:host([lg]) label:not(:empty) {
			text-align: center;
			font-size: 2em;
			font-weight: bold;
			margin: 1em 0 0 0;
			background: rgba(0,0,0,.7);
			color: #fff;
			padding: .25em .5em;
			border-radius: 2em;
		}

		:host(:not([show])) {
            visibility: hidden;
            opacity: 0;
        }

		b-spinner {
			font-size: var(--spinnerSize);
		}
    `;
  }

  render() {
    return _litElement.html`
		<main>
			<b-spinner></b-spinner>
			<label>${this.label}</label>
		</main>
    `;
  }

}

exports.SpinnerOverlayElement = SpinnerOverlayElement;
customElements.define('b-spinner-overlay', SpinnerOverlayElement);
},{"lit-element":"+bhx","./spinner":"EnCN"}],"la8o":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const device = {
  get is_ios() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  get is_android() {
    return /android/i.test(navigator.userAgent);
  },

  get is_mobile() {
    return device.is_ios || device.is_android;
  }

};
var _default = device;
exports.default = _default;
},{}],"aYTp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploaderElement = void 0;

var _litElement = require("lit-element");

var _device = _interopRequireDefault(require("../util/device"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.device = _device.default;

class UploaderElement extends _litElement.LitElement {
  static get properties() {
    return {
      url: {
        type: String
      },
      disabled: {
        type: Boolean
      },
      accept: {
        type: String
      },
      multiple: {
        type: Boolean
      },
      placeholder: {
        type: String
      },
      files: {
        type: Array
      },
      dragging: {
        type: Boolean,
        reflect: true
      },
      uploading: {
        type: Boolean,
        reflect: true
      }
    };
  }

  static get styles() {
    return _litElement.css`
        :host {
            --hoverBgd: rgba(255,236,179 ,.7);
            --uploadingBgd: rgba(238,238,238 ,.8);
            --progressBgd: var(--hoverBgd);
            --hoverColor: currentColor;
            --uploadingColor: currentColor;
            background: var(--hoverBgd);
            width: 100%;
            height: 100%;
            display: block;
            position: absolute;
            z-index: 10000;
            left: 0;
            top: 0;
            visibility: hidden;
            /* pointer-events: none; */
        }

        :host([dragging]),
        :host([uploading]) {
            visibility: visible;
        }

        .placeholder {
            color: var(--hoverColor)
        }

        .progress {
            color: var(--uploadingColor)
        }

        .placeholder,
        .progress {
            position: absolute;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }
        
        :host([uploading]) {
            background: var(--uploadingBgd);
        }

        :host(:not([dragging])) .placeholder,
        :host(:not([uploading])) .progress {
            display: none;
        }

        .progress > div {
            position: relative
        }

        .progress .bar {
            position: absolute;
            height: 100%;
            left: 0;
            background: var(--progressBgd);
        }

        .choose {
            display: none;
        }
    `;
  }

  constructor() {
    super();
    this.url = '';
    this.disabled = false;
    this.accept = '';
    this.multiple = false;
    this.placeholder = 'Drop to upload';
    this.files = [];
    this._numUploading = 0;
    this._numUploaded = 0;
    this.dragging = false;
    this.uploading = false;
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(fn => {
      this[fn] = this['_' + fn].bind(this);
    });
  }

  get progress() {
    return this.files.length > 0 ? this._numUploaded / this.files.length * 100 : 0;
  }

  get autoUpload() {
    return this.hasAttribute('auto-upload');
  }

  render() {
    return _litElement.html`
        <input class="choose" type="file" @click=${e => e.stopPropagation()} @change=${this._inputChange} accept=${this.accept} ?multiple=${this.multiple}>
        <div class="placeholder">${this.placeholder}</div>
        <div class="progress">
            <div class="bar" style="width:${this.progress}%"></div>
            <div>
                <b-spinner></b-spinner>
                Uploading ${this._numUploading} of ${this.files.length}
            </div>
        </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.parent) return;
    this.parent = this.parentElement || this.getRootNode().host;
    this.parent.addEventListener('dragenter', this.dragenter, true);
    this.addEventListener('dragleave', this.dragleave, true);
    this.addEventListener('dragover', this.dragover, true);
    this.addEventListener('drop', this.drop, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.parent.removeEventListener('dragenter', this.dragenter);
    this.removeEventListener('dragleave', this.dragleave);
    this.removeEventListener('dragover', this.dragover);
    this.removeEventListener('drop', this.drop);
    this.parent = null;
  }

  _acceptFile(file) {
    let doAccept = true;
    let accept = this.accept;
    if (!accept) return true;
    return accept.split(',').find(patt => {
      patt = patt.trim();
      if (patt[0] == '.') return new RegExp(patt + '$').test(file.name);else return new RegExp(patt).test(file.type);
    });
  }

  chooseFile() {
    if (this.disabled) return;
    this.shadowRoot.querySelector('.choose').click();
  }

  _drop(e) {
    e.preventDefault();
    this.dragging = false;

    this._selectFiles(e.dataTransfer.files);
  }

  _inputChange(e) {
    this._selectFiles(e.target.files);
  }

  _selectFiles(files) {
    if (this.uploading) return;
    files = Array.from(files);
    if (!this.multiple) files = files.slice(0, 1);
    let valid = [];
    let invalid = [];
    files.forEach(file => {
      if (this._acceptFile(file)) valid.push(file);else invalid.push(file);
    });
    this.files = valid;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        invalid: invalid.length > 0 ? invalid : false
      }
    }));

    if (this.autoUpload && this.url) {
      this.upload();
    }
  }

  _dragover(e) {
    e.preventDefault(); // needed to allow `drop` event to trigger
  }

  _dragenter(e) {
    if (this.disabled || !e.dataTransfer.types.includes('Files')) return;
    this.dragging = true;
  }

  _dragleave(e) {
    this.dragging = false;
  }

  async upload({
    url = '',
    method = 'POST',
    fileKey = 'file',
    formData = {}
  } = {}) {
    if (this.uploading) throw new Error("Already uploading");
    url = url || this.url;
    if (!url) throw new Error("Missing URL");
    this._numUploading = 0;
    this._numUploaded = 0;
    this.uploading = true;
    let resp = [];

    for (let file of this.files) {
      let _formData = new FormData();

      _formData.append(fileKey, file);

      for (let key in formData) _formData.append(key, formData[key]);

      this._numUploading++;
      this.requestUpdate();
      let uploadResp = await fetch(url, {
        method: method,
        body: _formData
      }).then(resp => resp.json()).then(resp => {
        this._numUploaded++;
        this.requestUpdate();
        return resp;
      });
      resp.push(uploadResp);
    }

    this._numUploading = 0;
    this._numUploaded = 0;
    this.files = [];
    this.uploading = false;
    this.dispatchEvent(new CustomEvent('upload', {
      bubbles: true,
      composed: true,
      detail: resp
    }));
    return this.multiple ? resp : resp[0];
  }

}

exports.UploaderElement = UploaderElement;
customElements.define('b-uploader', UploaderElement);
},{"lit-element":"+bhx","../util/device":"la8o"}],"Yy3A":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaperElement = void 0;

var _litElement = require("lit-element");

class PaperElement extends _litElement.LitElement {
  static get properties() {
    return {
      color: {
        type: String,
        reflect: true
      },
      empty: {
        type: Boolean,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.color = '';
    this.empty = false;
  }

  static get styles() {
    return _litElement.css`
        :host {
            box-sizing: border-box;
            display: inline-block;
            background: var(--bgd);
            box-shadow: rgba(0,0,0,.1) 0 1px 5px;
            border: solid 1px transparent;
            border-radius: 3px;
            --padding: 1em;
            padding: var(--padding);
            position: relative;
            --bgd: #fff;
            --bgdAccent: #fff;
        }

        :host([block]) {
            display: block;
        }

        :host([empty]) {
            background: none;
            box-shadow: none;
            border: 1px dashed rgba(0,0,0,.3);
        }

        :host([centered]) {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        :host([border]) {
            border-left: solid 5px var(--bgdAccent);
        }

        :host([outline]) {
            box-shadow: none;
            border-color: rgba(0, 0, 0, 0.1);
        }

        :host([dense]) {
            --padding: .5em;
        }

        :host([compact]) {
            --padding: 0;
        }

        ::slotted(header:first-child) {
            border-radius: 3px 3px 0 0;
            margin: calc(var(--padding) * -1);
            margin-bottom: var(--padding);
            padding: var(--padding);
            display: flex; 
            align-content: center;
            justify-content: space-between;
        }

        :host([color="gray"]) {
            --bgd: #EEEEEE;
            --bgdAccent: #BDBDBD;
            color: #212121;
        }

        :host([color="blue"]) {
            --bgd: #2196F3;
            --bgdAccent: #1565C0;
            color: #fff;
        }

        :host([color="green"]) {
            --bgd: #27ae60;
            --bgdAccent: #00695C;
            color: #fff;
        }

        :host([color="red"]) {
            --bgd: #f44336;
            --bgdAccent: #c62828;
            color: #fff;
        }

        :host([color="orange"]) {
            --bgd: #FF9800;
            --bgdAccent: #EF6C00;
            color: #fff;
        }

        :host([color="yellow"]) {
            --bgd: #FFC107;
            --bgdAccent: #F9A825;
            color: #fff;
        }

        :host([color="purple"]) {
            --bgd: #673AB7;
            --bgdAccent: #4527A0;
            color: #fff;
        }

        :host([color="postit"]) {
            --bgd: #FFF8E1;
            --bgdAccent: #FFC107;
            /* color: #fff; */
        }
    `;
  }

  render() {
    return _litElement.html`
        <slot></slot>
    `;
  }

}

exports.PaperElement = PaperElement;
customElements.define('b-paper', PaperElement);
},{"lit-element":"+bhx"}],"a2/B":[function(require,module,exports) {
var define;
var global = arguments[3];
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate (y) {
        var date;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            var args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays (ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays :
            this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
        return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
            : (m) ? weekdays[m.day()] : weekdays;
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    var MS_PER_SECOND = 1000;
    var MS_PER_MINUTE = 60 * MS_PER_SECOND;
    var MS_PER_HOUR = 60 * MS_PER_MINUTE;
    var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':   return months;
                case 'quarter': return months / 3;
                case 'year':    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asQuarters     = makeAs('Q');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asQuarters     = asQuarters;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.24.0';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

},{}],"u+eY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimerElement = void 0;

var _litElement = require("lit-element");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TimerElement extends _litElement.LitElement {
  static get properties() {
    return {
      time: {
        type: Number
      },
      ms: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.time = 0;
    this.ms = false;
    this.running = this.hasAttribute('running') ? true : false;
  }

  get time() {
    return this.__time;
  }

  set time(val) {
    const oldVal = this.__time;
    if (!this.dur) this.dur = _moment.default.duration(val);else {
      let delta = val - oldVal;
      this.dur.add(delta);
    }
    if (val == 0) this.setAttribute('zero', '');else this.removeAttribute('zero');
    this.__time = val;
    this.requestUpdate('time', oldVal);
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: inline-flex;
			--zeroColor: rgba(0,0,0,.5);
        }

		.hours[value="0"],
		.hours[value="00"] {
			display: none;
		}

		.hours[value="0"] + span,
		.hours[value="00"] + span {
			display: none;
		}

		/* span, */
		/* unit[value="00"] {
			color: var(--zeroColor);
		} */
    `;
  }

  render() {
    return _litElement.html`
		<unit class="hours" value="${this.hours}">${this.hours}</unit>
		<span>:</span>
		<unit class="minutes" value="${this.minutes}">${this.minutes}</unit>
		<span>:</span>
		<unit class="seconds" value="${this.seconds}">${this.seconds}</unit>
		${this.ms ? _litElement.html`<unit class="ms">.${this.milliseconds}</unit>` : ''}
    `;
  }

  get running() {
    return this._lastTS != null;
  }

  set running(run) {
    if (!run) {
      this.removeAttribute('running');
      this._lastTS = null;
      clearInterval(this._progressInterval);
    } else if (!this.running) {
      this._lastTS = new Date().getTime();
      this._progressInterval = setInterval(this._progress.bind(this), 100);
      this.setAttribute('running', '');
    }
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  _progress() {
    let ts = new Date().getTime();
    let elapsedTime = ts - this._lastTS;
    this._lastTS = ts;
    this.time += elapsedTime;
  }

  get hours() {
    return String(this.dur.hours()).padStart(2, '0');
  }

  get minutes() {
    return String(this.dur.minutes()).padStart(2, '0');
  }

  get seconds() {
    return String(this.dur.seconds()).padStart(2, '0');
  }

  get milliseconds() {
    return Math.round(this.dur.milliseconds() / 100);
  }

  get format() {
    let str = [this.hours, this.minutes, this.seconds].join(':');
    if (this.ms) str += '.' + this.milliseconds;
    return str;
  }

}

exports.TimerElement = TimerElement;
customElements.define('b-timer', TimerElement);
},{"lit-element":"+bhx","moment":"a2/B"}],"+2dU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

/*
    https://undraw.co/illustrations
*/
class EmptyState extends _litElement.LitElement {
  static get properties() {
    return {
      value: {
        type: String
      }
    };
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: rgba(55,71,79,.2);
            font-size: 2em;
            text-align: center;
            padding: 1em;
            box-sizing: border-box;
            line-height: 1.2em;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        :host([static]) {
            position: static;
            height: auto;
            min-height: 1em;
        }

        :host([hidden]) {
            display: none;
        }

        :host([xs]) { font-size: .8em; }
        :host([sm]) { font-size: 1em; }
        :host([md]) { font-size: 1.4em; }
        :host([lg]) { font-size: 3em; }
    `;
  }

  render() {
    return _litElement.html`
        <slot>${this.value}</slot>
    `;
  }

}

exports.default = EmptyState;
customElements.define('b-empty-state', EmptyState);
},{"lit-element":"+bhx"}],"DcCw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

class Label extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: inline-block;
            text-transform: uppercase;
            color: rgba(0,0,0,.33);
            font-weight: bold;
            font-size: 1rem;
            line-height: 1rem;
            --dividerThickness: 1px;
            vertical-align: middle;
        }

        :host([hidden]) {
            display: none;
        }

        :host([filled]),
        :host([badge]),
        :host([outline]) {
            --bgd: #aaa;
            --color: #fff;
            padding: 0.15em 0.3em 0.1em;
            border-radius: 3px;
            font-size: .8rem;
            text-transform: none;
            background: var(--bgd);
            color: var(--color);
        }

        :host([xs]) { font-size: .6rem; line-height: .6rem; }
        :host([sm]) { font-size: .8rem; line-height: .8rem; }
        :host([lg]) { font-size: 1.2rem; line-height: 1.2rem; }
        :host([xl]) { font-size: 1.4rem; line-height: 1.4rem; }

        :host([outline]) {
            background: none;
            border: solid 1px;
            border-color: var(--bgd);
            --color: var(--bgd);
        }

        :host([badge]) {
            border-radius: 30px;
            /* padding-left: .6em;
            padding-right: .6em; */
            padding-right: .45em;
            padding-left: .45em;
            min-width: .3em;
            text-align: center;
            min-height: 1em;
        }

        :host([dot]) {
            height: 6px;
            width: 6px;
            min-width: 0;
            min-height: 0;
            padding: 0;
        }

        :host([filled="black"]), :host([badge="black"]) { --bgd: #333; }
        :host([filled="gray"]), :host([badge="gray"]) { --bgd: #ddd; --color: #777; }
        :host([filled="blue"]), :host([badge="blue"]) { --bgd: var(--blue); }
        :host([filled="red"]), :host([badge="red"]) { --bgd: var(--red); }
        :host([filled="orange"]), :host([badge="orange"]) { --bgd: var(--orange); }
        :host([filled="green"]), :host([badge="green"]) { --bgd: var(--green); }
        :host([filled="pink"]), :host([badge="pink"]) { --bgd: var(--pink); }
        

        :host([outline="black"]) { --bgd: #333; }
        :host([outline="gray"]) { --bgd: #ddd; }
        :host([outline="blue"]) { --bgd: var(--blue); }
        :host([outline="red"]) { --bgd: var(--red); }
        :host([outline="orange"]) { --bgd: var(--orange); }
        :host([outline="green"]) { --bgd: var(--green); }
        :host([outline="pink"]) { --bgd: var(--pink); }

        b-hr {
            display: none;
            margin: 0;
            width: auto;
            height: var(--dividerThickness);
        }

        b-hr:first-child {
            margin-right: 1em;
        }

        b-hr:last-child {
            margin-left: 1em;
        }

        :host([divider]) {
            display: grid;
            align-items: center;
            grid-template-columns: 0 auto 1fr;
        }

        :host([divider]) b-hr {
            display: block;
        }

        :host([divider="center"]) {
            grid-template-columns: 1fr auto 1fr;
        }

        :host([divider="right"]) {
            grid-template-columns: 1fr auto 0;
        }
    `;
  }

  render() {
    return _litElement.html`
        <b-hr></b-hr>
        <slot></slot>
        <b-hr></b-hr>
    `;
  }

}

exports.default = Label;
customElements.define('b-label', Label);
},{"lit-element":"+bhx"}],"Da++":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DefaultBgd = exports.BgdColors = void 0;
const InvalidImages = [];
const BgdColors = ['#2196F3', '#f44336', '#673AB7', '#00BCD4', '#009688', '#4CAF50', '#FFC107', '#FF5722', '#795548', '#607D8B'];
exports.BgdColors = BgdColors;
const DefaultBgd = '#aaa';
exports.DefaultBgd = DefaultBgd;

class AvatarElement extends HTMLElement {
  static get observedAttributes() {
    return ['initials', 'bgd', 'color', 'size', 'url', 'gravatar'];
  }

  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    temp.innerHTML = `<style>
			:host {
				--radius: 50%;
				--size: 1em;
				--bgd: ${this.bgd};
				--bgdDefault: transparent;
				--color: ${this.color};
				height: var(--size);
			    width: var(--size);
			    display: inline-block;
			    vertical-align: middle;
			}

			:host([shadow]) svg {
				box-shadow: rgba(0,0,0,.1) 0 1px 3px;
			}

			svg {
				border-radius: var(--radius);
			}
			
			svg rect {
				fill: var(--bgd);
			}
			
			svg text {
				fill: var(--color);
			}
			
			:host([nobgd]) svg.imgloaded rect {
				fill: transparent;
			}
			
			svg.imgloaded text {
				visibility: hidden;
			}
			
			:host([imgicon]) svg image {
				width: 70%;
				height: 70%;
				x: 15%;
				y: 15%;
			}
			
			svg.imgloading rect {
				fill: #eee;
			}

			svg.imgloaded rect {
				fill: var(--bgdDefault);
			}
			</style>
			
		<svg class="imgloading" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100%" height="100%" rx="0" ry="0"></rect>
            <text x="50%" y="50%" font-size="65" dominant-baseline="central" text-anchor="middle">${this.initials}</text>
			<image xlink:href="" x="0" y="0" width="100%" height="100%" onload="this.parentElement.classList.add('imgloaded')">
        </svg>`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    this.img = this.shadowRoot.querySelector('image');
    this.img.addEventListener('error', e => {
      this.img.style.display = 'none';
      this.img.parentElement.classList.remove('imgloading');
      let src = this.img.getAttribute('xlink:href');
      if (src) InvalidImages.push(src);
    });
  }

  connectedCallback() {
    // NOTE: https://stackoverflow.com/a/43837330/484780
    // this.style.display = 'inline-block'
    // this.style.verticalAlign = 'middle'
    // this.style.lineHeight = '0'
    if (this.hasAttribute('gravatar')) this.gravatar = this.getAttr('gravatar');
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[name] = newVal;
  }

  getAttr(name, defaultVal) {
    return this.hasAttribute(name) ? this.getAttribute(name) || defaultVal : defaultVal;
  }

  get initials() {
    return this.getAttr('initials', '-');
  }

  set initials(str) {
    this.shadowRoot.querySelector('text').innerHTML = str || '-';
    this.bgd = this.bgd; // update bgd to match initial change (wont change if user specified the bgd attr)
  }

  get bgd() {
    let color = this.getAttr('bgd');

    if (!color) {
      let initials = this.getAttr('initials', '').toLowerCase();

      if (!initials) {
        color = DefaultBgd;
      } else {
        let num = 0;

        for (let char of initials) {
          num += char.charCodeAt(0) - 97;
        }

        color = BgdColors[num % BgdColors.length];
      }
    }

    return color;
  }

  set bgd(color) {
    // if( this.style.getPropertyValue('--bgd') ) return
    this.style.setProperty('--bgd', color); // this.shadowRoot.querySelector('rect').setAttribute('fill', color||this.bgd)
  }

  get color() {
    return this.getAttr('color', '#fff');
  }

  set color(color) {
    this.style.setProperty('--color', color); // this.shadowRoot.querySelector('text').setAttribute('fill', color||this.color)
  }

  get size() {
    return this.getAttr('size', 24);
  }

  set size(size) {
    this.style.width = size + 'px';
    this.style.height = size + 'px'; // reload the gravatar to get the correct size

    this.gravatar = this.getAttr('gravatar');
  }

  set url(url) {
    this.img.parentElement.classList.remove('imgloaded');
    this.img.style.display = ''; // dont try to load an image we already know fails

    if (!url || InvalidImages.includes(url)) {
      this.img.style.display = 'none';
      this.img.setAttribute('xlink:href', '');
      return;
    }

    if (url) {
      this.img.parentElement.classList.add('imgloading');
      this.img.setAttribute('xlink:href', url);
    }
  }

  set gravatar(guid) {
    // wait until el is connected so we can determine the height of the avatar
    if (!this.isConnected || !guid) return;
    let size = this.offsetHeight * 2;
    if (size < 80) size = 80;
    this.url = guid ? `//gravatar.com/avatar/${guid}?d=404&s=${size}` : '';
  }

}

customElements.define('b-avatar', AvatarElement);

var _default = customElements.get('b-avatar');

exports.default = _default;
},{}],"IOAQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

customElements.define('b-hr', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            --bgd: rgba(0,0,0,.1);

            display: block;
            margin: 1em auto;
            height: 1px;
            width: 100%;
            background: var(--bgd);
            vertical-align: middle;
        }

        :host([short]) {
            width: 180px;
            max-width: 100%;
        }

        :host([vert]) {
            display: inline-block;
            min-height: 1em;
            height: auto;
            width: 1px;
            margin: 0 .5em;
            align-self: stretch;
        }
    `;
  } // dont support slotted content yet


  render() {
    return _litElement.html``;
  }

});

var _default = customElements.get('b-hr');

exports.default = _default;
},{"lit-element":"+bhx"}],"VANQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

customElements.define('b-sub', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: inline;
            position:relative;
            color: rgba(0,0,0,.4);
            font-size: .8em;
            font-weight: normal;
        }
    `;
  }

  render() {
    return _litElement.html`
        <slot></slot>
    `;
  }

});

var _default = customElements.get('b-sub');

exports.default = _default;
},{"lit-element":"+bhx"}],"bpDM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

// https://embedresponsively.com/ 
customElements.define('b-embed', class Embed extends _litElement.LitElement {
  static get properties() {
    return {
      url: {
        type: String,
        reflect: true
      }
    };
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: block;
            position:relative;
        }

        main {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            max-width: 100%;
        }

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `;
  }

  render() {
    return _litElement.html`
        <main>
            <iframe src='${this.formattedURL}' 
                    frameborder='0' 
                    allowfullscreen>
            </iframe>
        </main>
    `;
  }

  get formattedURL() {
    if (!this.url) return '';
    let match = Embed.isYoutube(this.url);

    if (match) {
      return 'https://www.youtube.com/embed/' + match[1];
    }

    return this.url;
  }

  static isYoutube(url) {
    return url.match(/(?:youtu\.be|youtube\.com)\/(?:watch\?v\=)?(?:embed\/)?(.+)/);
  }

});

var _default = customElements.get('b-embed');

exports.default = _default;
},{"lit-element":"+bhx"}],"ZCfn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

customElements.define('range-slider', class extends _litElement.LitElement {
  static get properties() {
    return {
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      step: {
        type: Number
      },
      range: {
        type: Boolean,
        reflect: true
      },
      value: {
        type: Object
      },
      label: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.label = 'auto';
    this.range = false;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.valMin = 0;
    this.valMax = 0;
    this.value = [0, 0];
  }

  static get styles() {
    return _litElement.css`
        :host {
            --size: 2px;
            --thumbSize: 14px;
            --color: var(--blue);
            --thumbColor: var(--color);
            --bgd: rgba(0,0,0,.4);
            --padding: 10px;

            display: inline-block;
            vertical-align: middle;
            position:relative;
            width: 140px;
            height: var(--size);
            margin: 0 auto;
            padding: var(--padding) 0;
            cursor: pointer;
            font-size: .9em;
            user-select: none;
        }

        rail, track {
            display: block;
            height: var(--size);
            width: 100%;
            background: var(--color);
            border-radius: 6px;
            position: absolute;
            top: var(--padding);
            left: 0;
        }

        rail {
            background: var(--bgd);
        }

        thumb {
            height: var(--thumbSize);
            width: var(--thumbSize);
            transform: translate(-50%, -50%);
            position: absolute;
            left: 0;
            top: calc(var(--padding) + (var(--size) / 2));
            background: var(--thumbColor);
            border-radius: var(--thumbSize);
        }

        thumb:before {
            content: '';
            position: absolute;
            height: 250%;
            width: 250%;
            left: -75%;
            top: -75%;
            background: var(--thumbColor);
            opacity: .2;
            border-radius: 30px;
            z-index: -1;
            transform: scale(.3);
            transform-origin: center center;
            opacity: 0;
            transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        thumb:hover:before {
            transform: scale(.9);
            opacity: .2;
        }

        thumb[active]:before {
            transform: scale(1);
            opacity: .2;
        }

        thumb[active] {
            background: var(--color);
        }

        thumb > div {
            position: absolute;
            font-size: .9em;
            background: var(--color);
            color: #fff;
            height: 2.2em;
            width: 2.2em;
            display: flex;
            justify-content: center;
            align-items: center;
            bottom: 100%;
            left: 50%;
            position: absolute;
            transform-origin: bottom left;
            transform: translate(0%,-9px) rotate(-45deg) scale(0);
            border-radius: 50% 50% 50% 0;
            transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            
        }

        thumb > div > span {
            transform: rotate(45deg)
        }

        :host([label="show"]) thumb > div,
        thumb:hover > div,
        thumb[active] > div {
            transform: translate(0%,-9px) rotate(-45deg) scale(1);
        }

        :host([label="none"]) thumb > div {
            display: none !important;
        }

        :host(:not([range])) thumb[min] {
            display: none;
        }

        .labels {
            display: flex;
            justify-content: space-between;
            margin-top: .75em;
        }
    `;
  }

  _polishVal(val) {
    val = parseFloat((Math.round(val / this.step) * this.step).toFixed(2));
    if (val < this.min) val = this.min;
    if (val > this.max) val = this.max;
    return val;
  }

  set value(val) {
    let oldVal = this.value;
    let oldMin = this.valMin;
    let oldMax = this.valMax;
    if (typeof val == 'string') val = val.split(',').map(s => parseFloat(s)); // setting both min and max

    if (Array.isArray(val)) {
      if (typeof val[0] !== 'number' || typeof val[1] !== 'number') return;
      val.sort();
      if (this.range) this.valMin = this._polishVal(val[0]);
      this.valMax = this._polishVal(val[1]);
      this.requestUpdate('value', oldVal);
      return;
    }

    if (typeof val !== 'number') return;
    val = this._polishVal(val); // console.log(val);

    let dmin = Math.abs(this.valMin - val);
    let dmax = Math.abs(this.valMax - val);

    if (this._active == 'max' && val == this.valMin) {
      this.valMax = val;
      if (this.range) this._active = 'min';
    } else if (this._active == 'min' && val == this.valMax) {
      this.valMin = val;
      this._active = 'max';
    } else if (!this.range || dmin == dmax && this.valMax > this.valMin && this._active == 'max' || dmax < dmin || val > this.valMax) {
      this.valMax = val;
      this._active = 'max';
    } else {
      this.valMin = val;
      if (this.range) this._active = 'min';
    } // this.setAttribute('value', this.value.join(','))


    if (!this._mouseDown) this._active = null; // nothing changed

    if (oldMin == this.valMin && oldMax == this.valMax) return;
    this._didChange = true;
    this.requestUpdate('value', oldVal);
  }

  get value() {
    return this.range ? [this.valMin, this.valMax] : this.valMax;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mousedown', this.mouseDown, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mousedown', this.mouseDown, true);
  }

  get _len() {
    return this.max - this.min;
  }

  get _minLeft() {
    return this.valMin / this._len * 100;
  }

  get _maxLeft() {
    return this.valMax / this._len * 100;
  }

  get _trackLength() {
    return this._maxLeft - this._minLeft;
  }

  get atMin() {
    return (this.range ? this.valMin : this.valMax) == this.min;
  }

  get atMax() {
    return this.valMax == this.max;
  }

  reset() {
    this.valMin = this.min;
    this.valMax = this.min; // this.valMax = this.range ? this.max : this.min

    this.value = [this.valMin, this.valMax];
    this.update();
  }

  render() {
    return _litElement.html`
        <rail></rail>
        <track style="left:${this._minLeft}%; width:${this._trackLength}%"></track>
        <thumb min ?active=${this._active == 'min'} style="left:${this._minLeft}%">
            <div><span>${this.valMin}</span></div>
        </thumb>
        <thumb max ?active=${this._active == 'max'} style="left:${this._maxLeft}%">
            <div><span>${this.valMax}</span></div>
        </thumb>
        <div class="labels">
            <!-- <b-label xs>0 hrs</b-label>
            <b-label xs>30 hrs</b-label> -->
        </div>
    `;
  }

  mouseDown(e) {
    if (e.which !== 1) return; // normal click

    window.addEventListener('mouseup', this.mouseUp, true);
    window.addEventListener('mousemove', this.mouseMove, true);
    this._mouseDown = true;
    this.mouseMove(e);
  }

  mouseUp() {
    this._active = null;
    this._mouseDown = false;
    window.removeEventListener('mouseup', this.mouseUp, true);
    window.removeEventListener('mousemove', this.mouseMove, true);
    this.update();

    if (this._didChange) {
      this._didChange = false;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value
        }
      }));
    }
  }

  mouseMove(e) {
    // already at the min/max, stop tracking mouse move until within range again
    if (this._active == 'min' && e.pageX < this._lastMousePos && this.atMin) return;
    if (this._active == 'max' && e.pageX > this._lastMousePos && this.atMax) return;
    this._lastMousePos = e.pageX;
    let offset = {
      x: this.offsetLeft,
      y: this.offsetTop
    };
    let parent = this.offsetParent;

    while (parent) {
      offset.x += parent.offsetLeft;
      offset.y += parent.offsetTop;
      parent = parent.offsetParent;
    } // let mouseX = offset.x < e.pageX ? (e.offsetX + e.srcElement.offsetLeft) : e.pagex


    let mouseX = e.screenX - window.screenX;
    let x = mouseX - offset.x;
    let percent = x / this.clientWidth * 100;
    let val = percent / 100 * this._len;
    this.value = val;
    this.dispatchEvent(new CustomEvent('changing', {
      bubbles: true,
      composed: true,
      detail: {
        value: val
      }
    }));
  }

});

var _default = customElements.get('range-slider');

exports.default = _default;
},{"lit-element":"+bhx"}],"2z4L":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// TODO: support prefixing?
var _default = (key, val) => {
  let ls = window.localStorage;

  if (val === undefined) {
    let data = ls.getItem(key);
    if (data === null || data === undefined) return undefined;
    var val = '';

    try {
      val = JSON.parse(data);
    } catch (e) {
      val = data;
    }

    return val && isAmplify ? val.data : val;
  }

  if (val === null) {
    return ls.removeItem(key);
  }

  val = JSON.stringify(val);
  return ls.setItem(key, val);
};

exports.default = _default;
},{}],"EIVk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

require("./icon");

require("../presenters/form-control/controls/range-slider");

var _moment = _interopRequireDefault(require("moment"));

var _store = _interopRequireDefault(require("../util/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Menu from '../presenters/menu'
// TODO: hook up settings menu
const formatTime = sec => {
  var dur = _moment.default.duration(sec * 1000);

  var hours = dur.hours();
  var min = hours > 0 ? String(dur.minutes()).padStart(2, '0') : dur.minutes();
  return (hours ? hours + ':' : '') + min + ':' + String(dur.seconds()).padStart(2, '0');
};

let ACTIVE_PLAYER = null;
customElements.define('b-audio', class extends _litElement.LitElement {
  static get properties() {
    return {
      src: {
        type: String,
        reflect: true
      },
      autoplay: {
        type: Boolean,
        reflect: true
      },
      playing: {
        type: Boolean,
        reflect: true
      } // currentTime: {type: Number},

    };
  }

  constructor(src = '', {
    autoplay = false
  } = {}) {
    super();
    this.src = src;
    this.autoplay = autoplay;
    this.playing = false;
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: block;
            position:relative;
            /* padding: 1em; */
            border: solid 1px rgba(0,0,0,.1);
            background: #fff;
            border-radius: var(--radius);
            --radius: 4px;
        }

        main {
            display: grid;
            grid-template-columns: 2em 45px 1fr 45px;
            align-items: center;
            justify-content: space-between;
            gap: .25em;
            padding-right: .5em;
        }

        .time {
            font-weight: bold;
        }

        .time.elapsed {
            text-align: right;
        }

        .btn-play {
            cursor: pointer;
            height: 1.5em;
            width: 1.5em;
            margin: .25em;
            padding: .25em;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-radius: 20px;
            /* margin-right: .5em; */
            background: #eee;
            /* color: #fff; */
            /* border: solid 2px; */
            transition: color .15s ease-in-out, border-color .15s ease-in-out;
        }

        :host([status="error"]) {
            background: var(--red-50) !important;
        }

        :host([status="error"]) .btn-play {
            color: var(--red);
            background: var(--red-100);
        }


        .btn-play:hover {
            color: var(--blue);
        }

        input[type=range] {
            -webkit-appearance: none;
            min-width: 100px;
            height: 10px;
            border-radius: 5px;
            background: var(--black);
            outline: none;
            padding: 0;
            margin: 0 .5em;
            border: none;
            box-shadow: none;
        }

        input[type=range]::-webkit-slider-runnable-track {
            border: none;
            height: 100%;
        }

        input[type=range]::-webkit-slider-thumb {
            display: none;
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: solid 2px #fff;
            background: var(--black);
            cursor: pointer;
            box-shadow: none;
            margin-top: -4px;
        }

        input[type=range]::-webkit-slider-thumb:hover {
            background: var(--blue);
        }

        input[type=range]:active::-webkit-slider-thumb {
            background: var(--blue);
        }

        input[type=range]:hover::-webkit-slider-thumb {
            display: block;
        }

        .settings {
            transform: rotate(90deg);
        }
    `;
  }

  render() {
    return _litElement.html`
        <main @mouseenter=${this.onHover} @mouseleave=${this.onHoverLeave}>
            <audio
                @loadedmetadata=${this.audioLoaded}
                @timeupdate=${this.audioTimeChange}
                @ended=${this.pause}
                @error=${this.audioLoadError}
            ></audio>
            <span class="btn-play icon-play" @click=${this.playPause}>
                <b-icon name=${this.playing ? 'pause' : 'play'}></b-icon>
            </span>
            <span class="elapsed time">00:00</span>
            <input type="range" value="0" disabled
                @input=${this.progressSliderChanging}
                @change=${this.progressSliderChangingDone}
                class="progress"/>
            <span class="remaining time">00:00</span>
            <!-- <b-btn clear icon="dot-3" class="settings" @click=${this.viewSettings}></b-btn> -->
        </main>
    `;
  } // events: {
  //     'mouseenter': 'onHover',
  //     'mouseleave': 'onHoverLeave',
  //     'mouseenter .progress': 'progressHover',
  //     'mouseleave .progress': 'progressHoverLeave',
  //     'input .progress': 'progressSliderChanging',
  //     'change .progress': 'progressSliderChangingDone',
  //     'click .btn-settings': 'viewSettings',
  //     'click .btn-play': 'playPause'
  // },


  firstUpdated() {
    this.audio = this.shadowRoot.querySelector('audio');
    this.progress = this.shadowRoot.querySelector('.progress');
    this.elapsed = this.shadowRoot.querySelector('.elapsed');
    this.remaining = this.shadowRoot.querySelector('.remaining');
    this.loadAudio(this.src);
  }

  get status() {
    return this.getAttribute('status');
  }

  set status(val) {
    this.setAttribute('status', val);
  }

  playPause() {
    this.audio.paused ? this.play() : this.pause();
  }

  play(src) {
    // if another audio player is playing, pause it
    if (ACTIVE_PLAYER && ACTIVE_PLAYER != this) ACTIVE_PLAYER.pause(); // if audio src has not loaded yet or we have been given a new src, load it now

    if (!this._loaded || src) {
      this.loadAudio(src || this.src);
      return;
    }

    if (this.status == 'error') return;
    ACTIVE_PLAYER = this;
    this.audio.play();
    this.playing = true;
  }

  pause() {
    ACTIVE_PLAYER = null;
    this.clip = null; // clear any clips

    this.audio.pause();
    this.playing = false;
  }

  skipBack(val) {
    this.skip(-val || -10);
  }

  skipForward(val) {
    this.skip(val || 10);
  }

  skip(amt) {
    var time = this.audio.currentTime + amt;
    if (time < 0) time = 0;
    if (time > this.audio.duration) time = this.audio.duration;
    this.audio.currentTime = time;
  }

  loadAudio(src) {
    this.status = 'loading';
    this.audio.src = src;
  } // Events ==================================================================


  audioLoadError() {
    this._loaded = true;
    this.status = 'error';
    this.progress.disabled = true;
  }

  audioLoaded() {
    this.status = 'loaded';
    this._loaded = true;
    this.progress.disabled = false;
    this.progress.max = this.audio.duration;
    this.setProgress(); // clips were set before fully loaded, so set them again if needed

    if (this.clip && this.clip.length == 2 && isNaN(this.clip[1])) this.playLastClip();else if (this.clip && this.clip.length > 2 && isNaN(this.clip[2])) this.playEndClips();else if (this.autoplay) this.play();
  }
  /*
      Playing <audio> time has changed
  */


  audioTimeChange() {
    // update the progress slider unless currently seeking
    if (!this.seeking) this.progress.value = this.audio.currentTime;
    this.setProgress(); // reached end of clip, stop

    if (this.clip && this.audio.currentTime >= this.clip[1]) {
      // more than one clip is given, remove the just finished clip and begin playing the next one
      if (this.clip.length > 2) {
        this.audio.pause();
        setTimeout(function () {
          // play next clip after 700ms pause
          this.playClip(this.clip.splice(2));
        }.bind(this), 700);
      } else {
        this.pause();
      }
    }
  }
  /*
      Set Progress: uses current poisition to adjust background of proress slider on and updates elapsed/remaining times
  */


  setProgress() {
    var percent = this.progress.value / this.audio.duration * 100;
    var time = this.progress.value;
    var color = '#2c3033'; // this.classList.contains('progress-hover') ? '#3498db' : '#2c3033';

    this.progress.style.background = "linear-gradient(to right, " + color + " " + percent + "%, #bbb " + percent + "%)";
    this.elapsed.innerHTML = formatTime(time);
    this.remaining.innerHTML = this.audio.duration == Infinity ? '' : formatTime(this.audio.duration - time);
  }

  progressSliderChanging() {
    this.seeking = true;
    this.wasPlaying = this.wasPlaying || !this.audio.paused;
    this.audio.pause();
    this.setProgress();
  }

  progressSliderChangingDone() {
    this.audio.currentTime = this.progress.value;
    this.wasPlaying && this.play();
    this.wasPlaying = null;
    this.seeking = false;
    this.progress.blur(); // so slider doesn't hijack the keyboard events
  }

  progressHover() {
    this.classList.add('progress-hover');
    this.setProgress();
  }

  progressHoverLeave() {
    this.classList.remove('progress-hover');
    this.setProgress();
  } // Clips ====================================================================


  setClipLength(item) {
    (0, _store.default)('audioplayer:clip-length', item.val);
  }

  clipLength() {
    return (0, _store.default)('audioplayer:clip-length') || 15;
  }

  playFirstClip() {
    if (this.audio.duration < this.clipLength()) return; // TODO: improve

    this.playClip([0, this.clipLength()]);
  }

  playLastClip() {
    if (this.audio.duration < this.clipLength()) return;
    this.playClip([this.audio.duration - this.clipLength(), this.audio.duration]);
  }

  playEndClips() {
    if (this.audio.duration < this.clipLength()) return;
    this.playClip([0, this.clipLength(), this.audio.duration - this.clipLength(), this.audio.duration]);
  }

  playClip(clip) {
    this.clip = clip;
    if (!isNaN(this.clip[0])) this.audio.currentTime = this.clip[0];
    this.play();
  } // Keyboard Shortcuts =======================================================


  onKeyPress(e) {
    if (this.status == 'error') return;
    e.preventDefault();
    e.stopPropagation();

    switch (e.which) {
      case 32:
        this.playPause();
        break;
      // space

      case 27:
        this.pause();
        break;
      // esc

      case 70:
        this.playFirstClip();
        break;
      // f

      case 76:
        this.playLastClip();
        break;
      // l

      case 69:
        this.playEndClips();
        break;
      // e

      case 37:
        // left
        if (e.shiftKey) this.audio.currentTime = 0;else this.skipBack(_.metaKey() ? 30 : 10);
        break;

      case 39:
        // right
        if (e.shiftKey) this.audio.currentTime = this.audio.duration;else this.skipForward(_.metaKey() ? 30 : 10);
        break;
    }
  }

  onHover() {
    this._onKeyPress = this._onKeyPress || this.onKeyPress.bind(this);
    window.addEventListener('keydown', this._onKeyPress);
  }

  onHoverLeave() {
    window.removeEventListener('keydown', this._onKeyPress);
  } // Settings & Utilities =====================================================
  // viewSettings(e){
  //     var menu = [{
  //         label: 'Tips',
  //         icon: 'lightbulb',
  //         dropdown: {
  //             view: marked("While hovered over the player, you can control via keybard shortcuts:  \n\n`space` = play/pause  \n`f` = play **first** clip  \n`l` = play **last** clip  \n`e` = play **end** clips  \n  \n`←` = skip **back** 10  \n`ctrl+←` 30 sec  \n`→` = skip **forward** 10  \n`ctrl+→` 30 sec"),
  //             align: 'leftBottom',
  //             w: 180
  //         }
  //     },{
  //         label: 'Clip Length',
  //         icon: 'clock',
  //         menu: {
  //             view: [
  //                 {label: '10 sec', val: 10},
  //                 {label: '15 sec', val: 15},
  //                 {label: '20 sec', val: 20},
  //                 {label: '30 sec', val: 30},
  //             ],
  //             onClick: 'setClipLength',
  //             selected: this.clipLength,
  //             align: 'leftBottom',
  //             w: 90
  //         }
  //     },'divider',{
  //         label: 'Fullscreen',
  //         icon: 'resize-full',
  //         onClick: 'fullscreenToggle'
  //     }]
  //     $(e.currentTarget).dropdown(menu, {
  //         w: 120,
  //         align: 'bottomLeft',
  //         trigger: 'none',
  //         context: this
  //     })
  // }


});

var _default = customElements.get('b-audio');

exports.default = _default;
},{"lit-element":"+bhx","./icon":"ncPe","../presenters/form-control/controls/range-slider":"ZCfn","moment":"a2/B","../util/store":"2z4L"}],"inC5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

/*
    TODO:
    - add sliding animation?
*/
customElements.define('b-carousel', class extends _litElement.LitElement {
  static get properties() {
    return {
      views: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.views = [];
    this.active = 0;
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: block;
            position:relative;
            --dotSize: 14px;
            --dotPadding: 4px;
            --dotMargin: 5px;
            --dotExpand: scale(1.4);
        }

        [hidden] {
            display: none;
        }

        nav {
            display: flex;
            margin: 1em 0;
            justify-content: center;
            align-items: center;
        }

        nav > div {
            width: var(--dotSize);
            height: var(--dotSize);
            margin: var(--dotMargin);
            padding: var(--dotPadding);
            cursor: pointer;
        }

        nav > div > div {
            height: 100%;
            width: 100%;
            border-radius: 20px;
            background: #ccc;
            transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }

        nav > div:hover > div {
            transform: var(--dotExpand);
        }

        nav > div[active] > div {
            background: #2196F3;
        }
        
        @media print {
            nav {
                display: none;
            }

            ::slotted(*) {
                display: block !important
            }
        }
    `;
  }

  render() {
    return _litElement.html`
        <slot></slot>
        <nav ?hidden=${this.views.length <= 1}>${this.views.map((v, i) => _litElement.html`
            <div i=${i} ?active=${i == this.active} @click=${this.navTo}>
                <div></div>
            </div>
        `)}</nav>
    `;
  }

  get active() {
    return this.__active;
  }

  set active(val) {
    this.__active = val;
    this.views.forEach(v => v.hidden = true);
    if (!this.views[val]) return;
    this.views[val].hidden = false;
    this.update();
  }

  navTo(e) {
    let i = e.currentTarget.getAttribute('i');
    this.active = i;
  }

  firstUpdated() {
    let slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', e => {
      this.views = slot.assignedElements();
      this.active = 0;
    });
  }

});

var _default = customElements.get('b-carousel');

exports.default = _default;
},{"lit-element":"+bhx"}],"AZEX":[function(require,module,exports) {
var define;
// Generated by CoffeeScript 1.10.0
var slice = [].slice;

(function (root, factory) {
  if ('function' === typeof define && define.amd != null) {
    return define([], factory);
  } else if (typeof exports !== "undefined" && exports !== null) {
    return module.exports = factory();
  } else {
    return root.UrlPattern = factory();
  }
})(this, function () {
  var P, UrlPattern, astNodeContainsSegmentsForProvidedParams, astNodeToNames, astNodeToRegexString, baseAstNodeToRegexString, concatMap, defaultOptions, escapeForRegex, getParam, keysAndValuesToObject, newParser, regexGroupCount, stringConcatMap, stringify;

  escapeForRegex = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  concatMap = function (array, f) {
    var i, length, results;
    results = [];
    i = -1;
    length = array.length;

    while (++i < length) {
      results = results.concat(f(array[i]));
    }

    return results;
  };

  stringConcatMap = function (array, f) {
    var i, length, result;
    result = '';
    i = -1;
    length = array.length;

    while (++i < length) {
      result += f(array[i]);
    }

    return result;
  };

  regexGroupCount = function (regex) {
    return new RegExp(regex.toString() + '|').exec('').length - 1;
  };

  keysAndValuesToObject = function (keys, values) {
    var i, key, length, object, value;
    object = {};
    i = -1;
    length = keys.length;

    while (++i < length) {
      key = keys[i];
      value = values[i];

      if (value == null) {
        continue;
      }

      if (object[key] != null) {
        if (!Array.isArray(object[key])) {
          object[key] = [object[key]];
        }

        object[key].push(value);
      } else {
        object[key] = value;
      }
    }

    return object;
  };

  P = {};

  P.Result = function (value, rest) {
    this.value = value;
    this.rest = rest;
  };

  P.Tagged = function (tag, value) {
    this.tag = tag;
    this.value = value;
  };

  P.tag = function (tag, parser) {
    return function (input) {
      var result, tagged;
      result = parser(input);

      if (result == null) {
        return;
      }

      tagged = new P.Tagged(tag, result.value);
      return new P.Result(tagged, result.rest);
    };
  };

  P.regex = function (regex) {
    return function (input) {
      var matches, result;
      matches = regex.exec(input);

      if (matches == null) {
        return;
      }

      result = matches[0];
      return new P.Result(result, input.slice(result.length));
    };
  };

  P.sequence = function () {
    var parsers;
    parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return function (input) {
      var i, length, parser, rest, result, values;
      i = -1;
      length = parsers.length;
      values = [];
      rest = input;

      while (++i < length) {
        parser = parsers[i];
        result = parser(rest);

        if (result == null) {
          return;
        }

        values.push(result.value);
        rest = result.rest;
      }

      return new P.Result(values, rest);
    };
  };

  P.pick = function () {
    var indexes, parsers;
    indexes = arguments[0], parsers = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return function (input) {
      var array, result;
      result = P.sequence.apply(P, parsers)(input);

      if (result == null) {
        return;
      }

      array = result.value;
      result.value = array[indexes];
      return result;
    };
  };

  P.string = function (string) {
    var length;
    length = string.length;
    return function (input) {
      if (input.slice(0, length) === string) {
        return new P.Result(string, input.slice(length));
      }
    };
  };

  P.lazy = function (fn) {
    var cached;
    cached = null;
    return function (input) {
      if (cached == null) {
        cached = fn();
      }

      return cached(input);
    };
  };

  P.baseMany = function (parser, end, stringResult, atLeastOneResultRequired, input) {
    var endResult, parserResult, rest, results;
    rest = input;
    results = stringResult ? '' : [];

    while (true) {
      if (end != null) {
        endResult = end(rest);

        if (endResult != null) {
          break;
        }
      }

      parserResult = parser(rest);

      if (parserResult == null) {
        break;
      }

      if (stringResult) {
        results += parserResult.value;
      } else {
        results.push(parserResult.value);
      }

      rest = parserResult.rest;
    }

    if (atLeastOneResultRequired && results.length === 0) {
      return;
    }

    return new P.Result(results, rest);
  };

  P.many1 = function (parser) {
    return function (input) {
      return P.baseMany(parser, null, false, true, input);
    };
  };

  P.concatMany1Till = function (parser, end) {
    return function (input) {
      return P.baseMany(parser, end, true, true, input);
    };
  };

  P.firstChoice = function () {
    var parsers;
    parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return function (input) {
      var i, length, parser, result;
      i = -1;
      length = parsers.length;

      while (++i < length) {
        parser = parsers[i];
        result = parser(input);

        if (result != null) {
          return result;
        }
      }
    };
  };

  newParser = function (options) {
    var U;
    U = {};
    U.wildcard = P.tag('wildcard', P.string(options.wildcardChar));
    U.optional = P.tag('optional', P.pick(1, P.string(options.optionalSegmentStartChar), P.lazy(function () {
      return U.pattern;
    }), P.string(options.optionalSegmentEndChar)));
    U.name = P.regex(new RegExp("^[" + options.segmentNameCharset + "]+"));
    U.named = P.tag('named', P.pick(1, P.string(options.segmentNameStartChar), P.lazy(function () {
      return U.name;
    })));
    U.escapedChar = P.pick(1, P.string(options.escapeChar), P.regex(/^./));
    U["static"] = P.tag('static', P.concatMany1Till(P.firstChoice(P.lazy(function () {
      return U.escapedChar;
    }), P.regex(/^./)), P.firstChoice(P.string(options.segmentNameStartChar), P.string(options.optionalSegmentStartChar), P.string(options.optionalSegmentEndChar), U.wildcard)));
    U.token = P.lazy(function () {
      return P.firstChoice(U.wildcard, U.optional, U.named, U["static"]);
    });
    U.pattern = P.many1(P.lazy(function () {
      return U.token;
    }));
    return U;
  };

  defaultOptions = {
    escapeChar: '\\',
    segmentNameStartChar: ':',
    segmentValueCharset: 'a-zA-Z0-9-_~ %',
    segmentNameCharset: 'a-zA-Z0-9',
    optionalSegmentStartChar: '(',
    optionalSegmentEndChar: ')',
    wildcardChar: '*'
  };

  baseAstNodeToRegexString = function (astNode, segmentValueCharset) {
    if (Array.isArray(astNode)) {
      return stringConcatMap(astNode, function (node) {
        return baseAstNodeToRegexString(node, segmentValueCharset);
      });
    }

    switch (astNode.tag) {
      case 'wildcard':
        return '(.*?)';

      case 'named':
        return "([" + segmentValueCharset + "]+)";

      case 'static':
        return escapeForRegex(astNode.value);

      case 'optional':
        return '(?:' + baseAstNodeToRegexString(astNode.value, segmentValueCharset) + ')?';
    }
  };

  astNodeToRegexString = function (astNode, segmentValueCharset) {
    if (segmentValueCharset == null) {
      segmentValueCharset = defaultOptions.segmentValueCharset;
    }

    return '^' + baseAstNodeToRegexString(astNode, segmentValueCharset) + '$';
  };

  astNodeToNames = function (astNode) {
    if (Array.isArray(astNode)) {
      return concatMap(astNode, astNodeToNames);
    }

    switch (astNode.tag) {
      case 'wildcard':
        return ['_'];

      case 'named':
        return [astNode.value];

      case 'static':
        return [];

      case 'optional':
        return astNodeToNames(astNode.value);
    }
  };

  getParam = function (params, key, nextIndexes, sideEffects) {
    var index, maxIndex, result, value;

    if (sideEffects == null) {
      sideEffects = false;
    }

    value = params[key];

    if (value == null) {
      if (sideEffects) {
        throw new Error("no values provided for key `" + key + "`");
      } else {
        return;
      }
    }

    index = nextIndexes[key] || 0;
    maxIndex = Array.isArray(value) ? value.length - 1 : 0;

    if (index > maxIndex) {
      if (sideEffects) {
        throw new Error("too few values provided for key `" + key + "`");
      } else {
        return;
      }
    }

    result = Array.isArray(value) ? value[index] : value;

    if (sideEffects) {
      nextIndexes[key] = index + 1;
    }

    return result;
  };

  astNodeContainsSegmentsForProvidedParams = function (astNode, params, nextIndexes) {
    var i, length;

    if (Array.isArray(astNode)) {
      i = -1;
      length = astNode.length;

      while (++i < length) {
        if (astNodeContainsSegmentsForProvidedParams(astNode[i], params, nextIndexes)) {
          return true;
        }
      }

      return false;
    }

    switch (astNode.tag) {
      case 'wildcard':
        return getParam(params, '_', nextIndexes, false) != null;

      case 'named':
        return getParam(params, astNode.value, nextIndexes, false) != null;

      case 'static':
        return false;

      case 'optional':
        return astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes);
    }
  };

  stringify = function (astNode, params, nextIndexes) {
    if (Array.isArray(astNode)) {
      return stringConcatMap(astNode, function (node) {
        return stringify(node, params, nextIndexes);
      });
    }

    switch (astNode.tag) {
      case 'wildcard':
        return getParam(params, '_', nextIndexes, true);

      case 'named':
        return getParam(params, astNode.value, nextIndexes, true);

      case 'static':
        return astNode.value;

      case 'optional':
        if (astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes)) {
          return stringify(astNode.value, params, nextIndexes);
        } else {
          return '';
        }

    }
  };

  UrlPattern = function (arg1, arg2) {
    var groupCount, options, parsed, parser, withoutWhitespace;

    if (arg1 instanceof UrlPattern) {
      this.isRegex = arg1.isRegex;
      this.regex = arg1.regex;
      this.ast = arg1.ast;
      this.names = arg1.names;
      return;
    }

    this.isRegex = arg1 instanceof RegExp;

    if (!('string' === typeof arg1 || this.isRegex)) {
      throw new TypeError('argument must be a regex or a string');
    }

    if (this.isRegex) {
      this.regex = arg1;

      if (arg2 != null) {
        if (!Array.isArray(arg2)) {
          throw new Error('if first argument is a regex the second argument may be an array of group names but you provided something else');
        }

        groupCount = regexGroupCount(this.regex);

        if (arg2.length !== groupCount) {
          throw new Error("regex contains " + groupCount + " groups but array of group names contains " + arg2.length);
        }

        this.names = arg2;
      }

      return;
    }

    if (arg1 === '') {
      throw new Error('argument must not be the empty string');
    }

    withoutWhitespace = arg1.replace(/\s+/g, '');

    if (withoutWhitespace !== arg1) {
      throw new Error('argument must not contain whitespace');
    }

    options = {
      escapeChar: (arg2 != null ? arg2.escapeChar : void 0) || defaultOptions.escapeChar,
      segmentNameStartChar: (arg2 != null ? arg2.segmentNameStartChar : void 0) || defaultOptions.segmentNameStartChar,
      segmentNameCharset: (arg2 != null ? arg2.segmentNameCharset : void 0) || defaultOptions.segmentNameCharset,
      segmentValueCharset: (arg2 != null ? arg2.segmentValueCharset : void 0) || defaultOptions.segmentValueCharset,
      optionalSegmentStartChar: (arg2 != null ? arg2.optionalSegmentStartChar : void 0) || defaultOptions.optionalSegmentStartChar,
      optionalSegmentEndChar: (arg2 != null ? arg2.optionalSegmentEndChar : void 0) || defaultOptions.optionalSegmentEndChar,
      wildcardChar: (arg2 != null ? arg2.wildcardChar : void 0) || defaultOptions.wildcardChar
    };
    parser = newParser(options);
    parsed = parser.pattern(arg1);

    if (parsed == null) {
      throw new Error("couldn't parse pattern");
    }

    if (parsed.rest !== '') {
      throw new Error("could only partially parse pattern");
    }

    this.ast = parsed.value;
    this.regex = new RegExp(astNodeToRegexString(this.ast, options.segmentValueCharset));
    this.names = astNodeToNames(this.ast);
  };

  UrlPattern.prototype.match = function (url) {
    var groups, match;
    match = this.regex.exec(url);

    if (match == null) {
      return null;
    }

    groups = match.slice(1);

    if (this.names) {
      return keysAndValuesToObject(this.names, groups);
    } else {
      return groups;
    }
  };

  UrlPattern.prototype.stringify = function (params) {
    if (params == null) {
      params = {};
    }

    if (this.isRegex) {
      throw new Error("can't stringify patterns generated from a regex");
    }

    if (params !== Object(params)) {
      throw new Error("argument must be an object or undefined");
    }

    return stringify(this.ast, params, {});
  };

  UrlPattern.escapeForRegex = escapeForRegex;
  UrlPattern.concatMap = concatMap;
  UrlPattern.stringConcatMap = stringConcatMap;
  UrlPattern.regexGroupCount = regexGroupCount;
  UrlPattern.keysAndValuesToObject = keysAndValuesToObject;
  UrlPattern.P = P;
  UrlPattern.newParser = newParser;
  UrlPattern.defaultOptions = defaultOptions;
  UrlPattern.astNodeToRegexString = astNodeToRegexString;
  UrlPattern.astNodeToNames = astNodeToNames;
  UrlPattern.getParam = getParam;
  UrlPattern.astNodeContainsSegmentsForProvidedParams = astNodeContainsSegmentsForProvidedParams;
  UrlPattern.stringify = stringify;
  return UrlPattern;
});
},{}],"phBv":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const APP_TITLE = document.title;

class HistoryState {
  constructor(parent, props) {
    this.parent = parent;
    this.props = Object.assign({
      path: location.pathname,
      hash: location.hash,
      title: APP_TITLE
    }, props);
  }

  get num() {
    return this.props.num;
  }

  get isCurrent() {
    return history.state && history.state.num == this.num;
  }

  get isBefore() {
    return history.state && history.state.num > this.num;
  }

  get isBack() {
    return this.isBefore();
  }

  get isAfter() {
    return history.state && history.state.num < this.num;
  }

  get isForward() {
    return this.isAfter();
  }

  get path() {
    return this.props.path + this.props.hash;
  }

  update(props) {
    this.props = Object.assign(this.props, props); // if( this.isCurrent )
    // FIXME: hmmm...this is causing problems (#1930)
    // ...why did I do this in the first place? Do I actually need it?
    // yes, I need it, add hacky path check for now

    if ((!history.state || history.state.num == undefined) && this.path && this.path != '/') history.replaceState(this.props, null, this.path);
    this.parent.save();
    if (this.props.title && this.isCurrent) document.title = this.props.title;
  }

  toJSON() {
    return JSON.stringify(this.props);
  }

}

exports.default = HistoryState;
},{}],"OLbi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _historyState = _interopRequireDefault(require("./history-state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HistoryStates {
  constructor() {
    let storedData = sessionStorage.getItem('history-states');
    this.states = JSON.parse(storedData || '[]').map(props => new _historyState.default(this, JSON.parse(props)));
    this._current = history.state && history.state.num || -1;
    this.add(); // set initial state data
  }

  get length() {
    return this.states.length;
  }

  get current() {
    return this.get(this._current);
  }

  save() {
    sessionStorage.setItem('history-states', JSON.stringify(this.states));
  }

  get(num, create = false) {
    if (!this.states[num] && create) {
      this.states[num] = new _historyState.default(this, {
        num
      }); // this.save()
    }

    return this.states[num];
  }

  add(props = {}) {
    let oldNum = this._current;
    let num = history.state && history.state.num;

    if (num == undefined) {
      num = ++this._current; // remove trailing states as they are no longer valid

      this.states.splice(num + 1).forEach(state => {
        state.parent = null;
      });
    }

    let state = this.get(num, true);
    state.update(props);
    this._current = state.num;
    let step = oldNum > this._current ? -1 : 1;
    let oldStates = []; // console.log(oldNum, this._current);

    while (oldNum != this._current) {
      let oldState = this.get(oldNum);
      if (oldState) oldStates.push(oldState);
      oldNum += step;
    } // console.log(oldStates);


    return [state, oldStates];
  }

}

exports.default = HistoryStates;
},{"./history-state":"phBv"}],"38Qe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Route = exports.Router = void 0;

var _urlPattern = _interopRequireDefault(require("url-pattern"));

var _historyStates = _interopRequireDefault(require("./history-states"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/snd/url-pattern 
const ROUTES = [];
const APP_TITLE = document.title;
const PATH_ROOT = location.pathname;
const PATH_PREFIX = '#/';

class Router {
  // normalize path (always begin with `/#/`)
  // TODO: allow for prefix to be set by developer
  static normalizePath(path) {
    return path ? PATH_ROOT + PATH_PREFIX + path.replace(/^[#\/]+/, '') : path;
  }

  start(opts = {}) {
    opts = Object.assign({
      requireState: false
    }, opts);
    this.states = new _historyStates.default(); // listen for state changes and change routes accordingly

    window.addEventListener('popstate', e => {
      if (opts.requireState && !e.state) return; // probably a sheetview change, ignore

      let [newState, oldStates] = this.states.add();

      this._changeRoute(oldStates, newState);
    }); // trigger initial route

    this._changeRoute([], this.states.current);
  } // pushes new path/state onto stack (does not trigger route change)


  push(path, data = {}) {
    if (path instanceof Route) path = path.state ? path.state.path : path.rootPath;else path = Router.normalizePath(path);

    if (!path) {
      path = PATH_ROOT; // empty string doesn't work

      data.title = data.title || APP_TITLE;
    }

    history.pushState(data, null, path);
    if (data.title) document.title = data.title;
    return this.states.add(data);
  } // pushes new path/state and triggers route change


  goTo(path, data) {
    let [newState, oldStates] = this.push(path, data);

    this._changeRoute(oldStates, newState);
  }

  _changeRoute(oldStates, newState) {
    let dir = oldStates.length == 0 || oldStates[0].num < newState.num ? 'forward' : 'back';
    ROUTES.forEach(route => {
      route._change(oldStates, newState, dir);
    });
  }

  add(path, enter, exit) {
    new Route(path, enter, exit);
  }

  get routes() {
    return ROUTES.map(route => route.path);
  }

  get rootRoutes() {
    return ROUTES.map(route => route.rootPath);
  }

}

exports.Router = Router;

class Route {
  constructor(path, onChange) {
    path = Router.normalizePath(path);
    this.path = path;
    this.patt = new _urlPattern.default(path);
    this.change = onChange;
    ROUTES.push(this);
  }

  get params() {
    return this.state ? this.state.params : {};
  }

  get rootPath() {
    return this.patt.ast[0].value;
  }

  get isCurrent() {
    return this.state && this.state.isCurrent;
  }

  update(props) {
    this.state && this.state.update(props);
  }

  matches(state) {
    // array of states, get the last matched state in the list
    if (Array.isArray(state)) {
      let matchedState = null;

      for (let i in state) {
        if (this.matches(state[i])) matchedState = state[i];
      }

      return matchedState;
    }

    let params = state ? this.patt.match(state.path ? state.path : state) : false;

    if (params) {
      this.state = state;
      state.params = params;
      return state;
    }

    return null;
  }

  _change(oldState, newState, dir) {
    oldState = this.matches(oldState);
    newState = this.matches(newState);
    if (oldState || newState) this.change(oldState, newState, dir);
  }

} // singleton


exports.Route = Route;

var _default = new Router();

exports.default = _default;
},{"url-pattern":"AZEX","./history-states":"OLbi"}],"/jTP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeHTML = void 0;

var _parts = require("../lib/parts.js");

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// For each part, remember the value that was last rendered to the part by the
// unsafeHTML directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeHTML. If not, we'll always re-render the
// value passed to unsafeHTML.
const previousValues = new WeakMap();
/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */

const unsafeHTML = (0, _litHtml.directive)(value => part => {
  if (!(part instanceof _litHtml.NodePart)) {
    throw new Error('unsafeHTML can only be used in text bindings');
  }

  const previousValue = previousValues.get(part);

  if (previousValue !== undefined && (0, _parts.isPrimitive)(value) && value === previousValue.value && part.value === previousValue.fragment) {
    return;
  }

  const template = document.createElement('template');
  template.innerHTML = value; // innerHTML casts to string internally

  const fragment = document.importNode(template.content, true);
  part.setValue(fragment);
  previousValues.set(part, {
    value,
    fragment
  });
});
exports.unsafeHTML = unsafeHTML;
},{"../lib/parts.js":"atl2","../lit-html.js":"SP/d"}],"lo/u":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.15.0
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;

for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }

    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;
/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/

var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */


function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  } // NOTE: 1 DOM access here


  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}
/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */


function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }

  return element.parentNode || element.host;
}
/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */


function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;

    case '#document':
      return element.body;
  } // Firefox want us to check `-x` and `-y` variations as well


  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);
/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */

function isIE(version) {
  if (version === 11) {
    return isIE11;
  }

  if (version === 10) {
    return isIE10;
  }

  return isIE11 || isIE10;
}
/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */


function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null; // NOTE: 1 DOM access here

  var offsetParent = element.offsetParent || null; // Skip hidden elements which don't have an offsetParent

  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  } // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...


  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }

  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}
/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */


function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}
/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */


function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  } // Here we make sure to give as "start" the element that comes first in the DOM


  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1; // Get common ancestor container

  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer; // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  } // one of the nodes is inside shadowDOM, find which one


  var element1root = getRoot(element1);

  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}
/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */


function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';
  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}
/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */


function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}
/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */


function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';
  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);
  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */


function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}
/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */


function getBoundingClientRect(element) {
  var rect = {}; // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11

  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  }; // subtract scrollbar size from sizes

  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;
  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height; // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons

  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');
    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);
  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10); // In cases where the parent is fixed, we must ignore negative scroll in offset calc

  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }

  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0; // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.

  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);
    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft; // Attach marginTop and marginLeft because in some circumstances we may need them

    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);
  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;
  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };
  return getClientRect(offset);
}
/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */


function isFixed(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }

  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }

  var parentNode = getParentNode(element);

  if (!parentNode) {
    return false;
  }

  return isFixed(parentNode);
}
/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */


function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }

  var el = element.parentElement;

  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }

  return el || document.documentElement;
}
/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */


function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false; // NOTE: 1 DOM access here

  var boundaries = {
    top: 0,
    left: 0
  };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference); // Handle viewport case

  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;

    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));

      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition); // In case of HTML, we need a different computation

    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  } // Add paddings


  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;
  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;
  return width * height;
}
/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };
  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });
  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });
  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
  var variation = placement.split('-')[1];
  return computedPlacement + (variation ? '-' + variation : '');
}
/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */


function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}
/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */


function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}
/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */


function getOppositePlacement(placement) {
  var hash = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}
/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */


function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0]; // Get popper node sizes

  var popperRect = getOuterSizes(popper); // Add position, width and height to our offsets object

  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  }; // depending by the popper placement we have to compute its offsets slightly differently

  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';
  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;

  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}
/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */


function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  } // use `filter` to obtain the same behavior of `find`


  return arr.filter(check)[0];
}
/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */


function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  } // use `find` + `indexOf` if `findIndex` isn't supported


  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}
/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */


function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));
  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }

    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation

    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);
      data = fn(data, modifier);
    }
  });
  return data;
}
/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */


function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  }; // compute reference element offsets

  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed); // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value

  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding); // store the computed placement inside `originalPlacement`

  data.originalPlacement = data.placement;
  data.positionFixed = this.options.positionFixed; // compute the popper offsets

  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute'; // run the modifiers

  data = runModifiers(this.modifiers, data); // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback

  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}
/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */


function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}
/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */


function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;

    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }

  return null;
}
/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */


function destroy() {
  this.state.isDestroyed = true; // touch DOM only if `applyStyle` modifier is enabled

  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners(); // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it

  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }

  return this;
}
/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */


function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, {
    passive: true
  });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }

  scrollParents.push(target);
}
/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */


function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, {
    passive: true
  }); // Scroll event listener on scroll parents

  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;
  return state;
}
/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */


function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}
/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */


function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound); // Remove scroll event listener on scroll parents

  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  }); // Reset state

  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}
/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */


function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}
/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */


function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */


function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = ''; // add unit if the value is numeric and is one of the following

    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }

    element.style[prop] = styles[prop] + unit;
  });
}
/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */


function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];

    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */


function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles); // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element

  setAttributes(data.instance.popper, data.attributes); // if arrowElement is defined and arrowStyles has some properties

  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}
/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */


function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed); // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value

  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
  popper.setAttribute('x-placement', placement); // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations

  setStyles(popper, {
    position: options.positionFixed ? 'fixed' : 'absolute'
  });
  return options;
}
/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */


function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);
  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;
  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;
  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */

function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper; // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;

  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }

  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;
  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent); // Styles

  var styles = {
    position: popper.position
  };
  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);
  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right'; // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed

  var prefixedProperty = getSupportedPropertyName('transform'); // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.

  var left = void 0,
      top = void 0;

  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }

  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }

  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  } // Attributes


  var attributes = {
    'x-placement': data.placement
  }; // Update `data` attributes, styles and arrowStyles

  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);
  return data;
}
/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */


function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });
  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';

    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }

  return isRequired;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function arrow(data, options) {
  var _data$offsets$arrow; // arrow depends on keepTogether in order to work


  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element; // if arrowElement is a string, suppose it's a CSS selector

  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement); // if arrowElement is not found, don't run the modifier

    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var isVertical = ['left', 'right'].indexOf(placement) !== -1;
  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len]; //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //
  // top/left side

  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  } // bottom/right side


  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }

  data.offsets.popper = getClientRect(data.offsets.popper); // compute center of the popper

  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2; // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available

  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide; // prevent arrowElement from being placed not contiguously to its popper

  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);
  return data;
}
/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */


function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }

  return variation;
}
/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */


var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start']; // Get rid of `auto` `auto-start` and `auto-end`

var validPlacements = placements.slice(3);
/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */

function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */

function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);
  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';
  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;

    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;

    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;

    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);
    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference; // using floor because the reference offsets may contain decimals we are not going to consider here

    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);
    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom; // flip the variation if required

    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1; // flips variation if reference element overflows boundaries

    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom); // flips variation if popper content overflows boundaries

    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);
    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : ''); // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future

      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));
      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }

  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}
/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */


function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2]; // If it's not a number it's an operator, I guess

  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;

    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;

      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;

    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}
/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */


function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0]; // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one

  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1; // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)

  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  }); // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space

  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  } // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.


  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments]; // Convert the values with units to absolute pixels to allow our computations

  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, []) // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  }); // Loop trough the offsets arrays and execute the operations

  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */


function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var basePlacement = placement.split('-')[0];
  var offsets = void 0;

  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper); // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken

  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  } // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself


  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification

  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];
  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';
  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed); // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed

  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;
  options.boundaries = boundaries;
  var order = options.priority;
  var popper = data.offsets.popper;
  var check = {
    primary: function primary(placement) {
      var value = popper[placement];

      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }

      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];

      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }

      return defineProperty({}, mainSide, value);
    }
  };
  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });
  data.offsets.popper = popper;
  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1]; // if shift shiftvariation is specified, run the modifier

  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;
    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';
    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };
    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}
/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */


function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;
  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;
  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);
  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);
  return data;
}
/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */


var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: offset,

    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: preventOverflow,

    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],

    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,

    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: arrow,

    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: flip,

    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',

    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,

    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',

    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,

    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,

    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,

    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: computeStyle,

    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,

    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',

    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,

    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,

    /** @prop {ModifierFn} */
    fn: applyStyle,

    /** @prop {Function} */
    onLoad: applyStyleOnLoad,

    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};
/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */

var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};
/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */
// Utils
// Methods

var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    }; // make update() debounced, so that it only runs at most once-per-tick


    this.update = debounce(this.update.bind(this)); // with {} we create a new object with the options inside it

    this.options = _extends({}, Popper.Defaults, options); // init state

    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    }; // get reference and popper elements (allow jQuery wrappers)

    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper; // Deep merge modifiers options

    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    }); // Refactoring modifiers' list (Object => Array)

    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    }) // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    }); // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!

    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    }); // fire the first update to position the popper in the right place

    this.update();
    var eventsEnabled = this.options.eventsEnabled;

    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  } // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }
    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */

    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();
/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;
var _default = Popper;
exports.default = _default;
},{}],"r4vn":[function(require,module,exports) {

},{}],"Soyf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DefaultOpts = void 0;

var _popper = _interopRequireDefault(require("popper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
	Popover
*/
const styles = require('./style.less');

const DefaultOpts = {
  align: 'bottom',
  className: '',
  clickToggles: true,
  closeOnHide: true,
  maxHeight: 'auto',
  maxHeightThreshold: 400,
  onClose: () => {},
  onKeydown: e => {}
};
exports.DefaultOpts = DefaultOpts;
const OpenPopovers = [];
let WatchingClicks = false;
let WatchingKeyboard = false;

const WatchClicks = function (e) {
  let found = false;
  let close = []; // the clicked target already has a popover and has the "toggle" setting, so close the current popover

  if (e.target.popover && e.target.popover.view != e.target && e.target.popover.opts.clickToggles) {
    e.target.popover._close();

    e.preventDefault();
    e.stopPropagation();
    return false;
  } // close all popovers not part (nested) within the clicked target


  OpenPopovers.slice(0).reverse().forEach(dd => {
    if (!found && !dd.contains(e.target)) {
      close.push(dd); // as soon as one of the popovers is nested, all others that follow will be nested, no reason to continue testing
    } else {
      found = true;
    }
  });
  close.forEach(dd => dd._close());
};

const WatchKeyboard = function (e) {
  let popover = OpenPopovers.slice(0).pop();

  popover._onKeydown(e);
};

class Popover {
  constructor(target, view, opts = {}) {
    opts = Object.assign({}, DefaultOpts, opts);

    if (!WatchingClicks) {
      WatchingClicks = true;
      window.addEventListener('click', WatchClicks, true);
    }

    if (!WatchingKeyboard) {
      WatchingKeyboard = true;
      window.addEventListener('keydown', WatchKeyboard, true);
    }

    if (typeof view == 'string') {
      if (customElements.get(view)) {
        view = document.createElement(view);
      } else {
        let _view = document.createElement('div');

        _view.classList.add('tooltip');

        _view.innerHTML = view;
        view = _view;
      }
    }

    if (window.Backbone && view instanceof window.Backbone.View) view = view.el;
    this.opts = opts;
    this.target = target;
    this.view = view;
    this.target.classList.add('popover-open');
    this.view.classList.add('__view');
    this.el = document.createElement('div');
    this.el.classList.add('popover');
    this.el.innerHTML = '<span class="__arrow" x-arrow><span class="__arrow" x-arrow></span></span>';
    this.el.appendChild(view);
    document.body.append(this.el);

    if (this.opts.className) {
      this.opts.className.split(' ').forEach(className => this.el.classList.add(className));
    }

    this.target.popover = this;
    this.el.popover = this;
    this.view.popover = this; // set position of the popover using Popper

    this.popper = new _popper.default(target, this.el, {
      placement: opts.align,
      removeOnDestroy: true,
      onCreate: this._onPositionCreate.bind(this),
      onUpdate: this._onPositionUpdate.bind(this),
      modifiers: {
        // flip: {enabled: !this.isNested},
        // hide: {enabled: !this.isNested},
        preventOverflow: {
          enabled: opts.preventDefault !== undefined ? opts.preventDefault : true,
          // FIXME: confusing naming and not sure it works
          boundariesElement: opts.overflowBoundry || 'scrollParent',
          // priority: []
          priority: ['top', 'bottom'].includes(opts.align) ? ['left', 'right'] : ['top', 'bottom']
        }
      }
    }); // watch for the view to add elements so we can adjust position

    this.mutationObserver = new MutationObserver(this.viewMutated.bind(this));
    this.mutationObserver.observe(this.view, {
      attributes: true,
      childList: true,
      subtree: false
    }); // keep track of open popovers so we can remove them later

    OpenPopovers.push(this);
  }

  contains(target) {
    if (this.el.contains(target)) return true; // let parentPopover = this.parentPopover
    // if( parentPopover && parentPopover.contains(target) )
    // 	return true

    let targetParent = target.parentElement && target.parentElement.popover;
    if (targetParent && this.el.contains(targetParent.target)) return true;
    return false;
  }

  get parentPopover() {
    let parentPopover = false;
    let parent = this.target;

    while (parent && !parentPopover) {
      parent = parent.parentElement;
      if (parent && parent.popover) parentPopover = parent;
    }

    return parentPopover;
  }

  get isNested() {
    return !!this.parentPopover;
  }

  viewMutated(mutationsList, observer) {
    this._updatePosition();
  }

  close() {
    if (!this.target.popover) return;
    this.target.popover = null;
    this.el.popover = null;
    this.view.popover = null;
    this.mutationObserver.disconnect();
    this.popper.destroy();
    this.target.classList.remove('popover-open'); // remove this from the list of open popovers as well as all popovers after it

    var indx = OpenPopovers.indexOf(this);

    if (indx > -1) {
      OpenPopovers.splice(indx).forEach((dd, i) => {
        if (i > 0) dd._close(); // close all popovers nested inside of this one
      });
    } // no more popovers, remove event listners


    if (OpenPopovers.length == 0) {
      WatchingClicks = false;
      window.removeEventListener('click', WatchClicks, true);
      WatchingKeyboard = false;
      window.removeEventListener('keydown', WatchKeyboard, true);
    }
  } // internal close method that also triggers the onClose callback


  _close() {
    this.close();
    this.opts.onClose && this.opts.onClose();
  }

  _updatePosition() {
    this.popper.update();
  }

  _onPositionCreate(data) {
    data.instance.modifiers.forEach(m => {
      if (m.name == 'preventOverflow' && m.boundaries) {
        this.maxHeight = m.boundaries.height;
        this.view.style.maxWidth = this.opts.maxWidth || '';
      }
    });
  }

  _onPositionUpdate(data) {
    if (data.hide && this.opts.closeOnHide) this._close();
  }

  _onKeydown(e) {
    if (this.opts.onKeydown) this.opts.onKeydown(e);
  }

  set maxHeight(val) {
    if (this.opts.maxHeight != 'auto') this.view.style.maxHeight = this.opts.maxHeight;else if (this.opts.maxHeight !== false && this.view.offsetHeight > this.opts.maxHeightThreshold) this.view.style.maxHeight = val;
  }

}

exports.default = Popover;
},{"popper.js":"lo/u","./style.less":"r4vn"}],"R9Fe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _menu = _interopRequireDefault(require("../menu"));

var _router = _interopRequireDefault(require("../../router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PanelControllers = {};

class PanelController extends _litElement.LitElement {
  static for(name) {
    // create a root panel controller if there isn't one
    if (name == 'root' && !PanelControllers[name]) {
      let rootPanelController = document.createElement('b-panels');
      rootPanelController.setAttribute('name', 'root');
      document.body.appendChild(rootPanelController);
      PanelControllers[name] = rootPanelController;
    }

    return PanelControllers[name];
  }

  static get styles() {
    return _litElement.css`
        :host {
            position: relative;
            /* z-index: 10; */
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            pointer-events: none;
        }
    `;
  }

  get name() {
    return this.hasAttribute('name') ? this.getAttribute('name') : undefined;
  }

  constructor() {
    super();
    this.panels = new Map();

    if (this.name) {
      if (PanelControllers[this.name]) console.warn('A panel-controller already exists with the name: ', this.name);else PanelControllers[this.name] = this;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.hasAttribute('name') && PanelControllers[this.name] == this) delete PanelControllers[this.name];
  }

  render() {
    return _litElement.html`        
        <slot></slot>
    `;
  }

  remove(panel) {
    this.panels.delete(panel);

    this._updatePanels();
  }

  add(panel) {
    // let SheetView and Panel work together
    document.body.setAttribute('ontop', 'panel');
    this.panels.delete(panel);
    this.panels.set(panel, panel);
    if (!this.contains(panel)) this.append(panel);

    this._updatePanels();
  }

  _updatePanels(updateRoutes = false) {
    let i = 0; // if( this.length == 0 && updateRoutes )
    //     router.push('')
    // else

    this.panels.forEach(panel => {
      if (panel.type != 'modal') panel.style.zIndex = i++;

      if (i == this.length) {
        panel.setAttribute('ontop', ''); // if( updateRoutes && panel.route && !panel.route.isCurrent ){
        //     console.log(panel.route);
        //     // router.push(panel.route.path)
        // }
      } else {
        panel.removeAttribute('ontop');
      }
    });

    if (this.parentElement) {
      if (this.length == 0) {
        this.parentElement.classList.remove('b-panel-open');
        this.parentElement.style.overflow = '';
      } else {
        this.parentElement.classList.add('b-panel-open');
        this.parentElement.style.overflow = 'hidden';
      }
    }
  }

  _updateRoute() {
    let i = 0;

    if (this.length == 0) {
      // TEMP - improve interoperability with Groundwork
      if (window.app && app.sv('sheets').sheets.length > 0) app.sv('sheets').setHash();else _router.default.push('');
    } else this.panels.forEach(panel => {
      if (panel.onTop && panel.route && !panel.route.isCurrent) {
        // console.log(panel.route, panel.route.state.path);
        _router.default.push(panel.route);
      }
    });
  }

  get length() {
    return this.panels.size;
  }

  map(fn) {
    let resp = [];
    this.panels.forEach(p => resp.push(fn(p)));
    return resp.reverse(); // most recent first
  }

  async quickJump(el) {
    let menu = this.map(panel => {
      return {
        label: panel.title,
        icon: panel.icon || 'window',
        description: panel.hash,
        panel: panel
      };
    });
    menu.shift(); // remove first menu as its the open view

    let ts = new Date().getTime(); // quick jump is already open

    if (el.popover) {
      // if quick jump triggered within a second, auto switch to the last opened view
      if (el.quickJumpOpened && ts - el.quickJumpOpened <= 1000 && menu.length > 0) {
        el.popover.close();
        menu[0].panel.open();
      }

      return;
    }

    el.quickJumpOpened = ts;
    if (menu.length == 0) menu.push({
      text: 'No other views open'
    });
    menu.unshift({
      divider: 'Quick Jump Menu'
    }, 'divider');
    let selected = await new _menu.default(menu).popover(el, {
      align: 'bottom-start'
    });
    if (selected) selected.panel.open();
  }

}

customElements.define('b-panels', PanelController);

var _default = customElements.get('b-panels');

exports.default = _default;
},{"lit-element":"+bhx","../menu":"0tCY","../../router":"38Qe"}],"ZNP1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

class PanelToolbar extends _litElement.LitElement {
  static get properties() {
    return {
      title: {
        type: String
      },
      look: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.title = '';
    this.look = '';
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: grid;
            grid-template-columns: 1fr max-content 1fr;
            /* background: linear-gradient(to bottom, #fff, #f5f5f5); */
            padding: .5em;
            padding: .4em .5em .3em;
            box-sizing: border-box;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px 4px 0 0;
            min-height: 40px;
        }

        :host([overlay]) {
            background: none;
            box-shadow: none;
            position: absolute;
            z-index: 100;
            pointer-events: none;
            top: 0;
            left: 0;
            width: 100%;
        }

        :host([overlay]) > div * {
            pointer-events: initial;
        }

        :host([shadow]) {
            box-shadow: rgba(0,0,0,.2) 0 0 6px;
        }

        :host([look="white"]) {
            background: #fff;
        }

        :host([look="silver"]) {
            background: linear-gradient(to bottom,#eee,#ddd);
            border-bottom: solid 1px #bbb;
        }

        :host([look="clear"]) {
            background: transparent;
        }

        :host([look="dark"]) {
            /* background: #2c3033; */
            background: linear-gradient(to bottom,#303538,#2c3033);
            color: #fff;
        }

        :host([look="dark"]) b-btn[outline] {
            --color: #ddd
        }

        slot[name="title"] {
            font-weight: bold;
            font-size: 1.1em;
        }

        :host([notitle]) slot[name="title"] {
            display: none;
        }

        .right {
            text-align: right;
        }

        @media print {
            b-btn {
                display: none; /* assume we dont want buttons to display on print */
            }
        }

    `;
  }

  render() {
    return _litElement.html`
        <div class="left">
            <slot name="close-btn">
                <b-btn outline icon="cancel-1" title="Right+click for quick jump menu"
                    @click=${this.close} @contextmenu=${this.quickJump}></b-btn>
            </slot>
            <slot name="left"></slot>
        </div>
        <div class="middle">
            <slot name="title">${this.title}</slot>
            <slot name="middle"></slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    `;
  }

  close() {
    this.panel && this.panel.close();
  }

  quickJump(e) {
    e.preventDefault();
    this.panel && this.panel.panelController && this.panel.panelController.quickJump(e.target);
  }

}

customElements.define('b-panel-toolbar', PanelToolbar);

var _default = customElements.get('b-panel-toolbar');

exports.default = _default;
},{"lit-element":"+bhx"}],"cmZt":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Panel = exports.Modal = exports.register = exports.PanelDefaults = void 0;

var _litElement = require("lit-element");

var _controller = _interopRequireDefault(require("./controller"));

var _router = _interopRequireWildcard(require("../../router"));

require("./toolbar");

require("../../elements/btn");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PanelDefaults = {
  type: '',
  closeBtn: false,
  title: '',
  width: '100%',
  height: '100%',
  anchor: 'right',
  animation: '',
  closeOnEsc: false,
  controller: null,
  // root controller will be created and used
  disableBackdropClick: false
};
exports.PanelDefaults = PanelDefaults;

class RegisteredPanels {
  constructor() {
    this.register = new Map();
  }

  set(key, data) {
    return this.register.set(key, data);
  }

  get(path) {
    return this.register.get(path);
  }

  add(path, view, opts = {}) {
    if (this.get(path)) {
      return console.warn(`A panel is already registered for ${path}`);
    }

    this.set(path, {
      view,
      opts
    });
    if (opts.route !== false) this.get(path).route = new _router.Route(path, (oldState, newState, dir) => {
      if (this._initiate(path)) this.get(path).panel._routeChange(oldState, newState, dir);
    });
  }

  _initiate(path) {
    let registered = this.get(path);

    if (!registered) {
      console.error(`Panel for ${path} not found`);
      return false;
    } // first time this panel is being requested


    if (!registered.panel) {
      if (typeof registered.view == 'function') {
        registered.panel = new Panel();
        registered.panel.html = registered.view;
      } else registered.panel = new Panel(registered.view);

      if (registered.route) registered.panel.route = registered.route; // copy properties to panel

      if (registered.opts) {
        for (let key in registered.opts) {
          if (key != 'route') registered.panel[key] = registered.opts[key];
        }
      }
    }

    return true;
  }

  open(path) {
    if (!this._initiate(path)) return;
    let registered = this.get(path);
    if (registered.route) _router.default.goTo(registered.route);else registered.panel.open();
  }

}

const register = new RegisteredPanels();
exports.register = register;

const Modal = function (view, opts = {}) {
  opts = Object.assign({
    type: 'modal'
  }, opts);
  if (opts.closeBtn && opts.closeOnEsc === undefined) opts.closeOnEsc = true;
  return new Panel(view, opts).open();
};

exports.Modal = Modal;

class Panel extends _litElement.LitElement {
  static get properties() {
    return {
      title: {
        type: String
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      anchor: {
        type: String,
        reflect: true
      },
      type: {
        type: String,
        reflect: true
      },
      animation: {
        type: String,
        reflect: true
      }
    };
  }

  static register(path, view, opts) {
    register.add(path, view, opts);
  }

  static open(path) {
    register.open(path);
  }

  static get animationTime() {
    return 300;
  }

  constructor(view, opts = {}) {
    super();
    let defaultOpts = Object.assign({}, PanelDefaults);

    if (opts.type == 'modal') {
      defaultOpts.width = 'auto';
      defaultOpts.height = 'auto';
      defaultOpts.anchor = 'center';
    }

    opts = Object.assign(defaultOpts, opts);
    this.animation = opts.animation;
    this.type = opts.type;
    this.closeBtn = opts.closeBtn;
    this.title = opts.title;
    this.width = opts.width;
    this.height = opts.height;
    this.anchor = opts.anchor;
    this.panelController = opts.controller;
    this.opts = opts;

    if (typeof view == 'function') {
      this.html = view;
    } else if (typeof view == 'string') {
      this.view = document.createElement(view);
    } else if (view instanceof HTMLElement) {
      this.view = view;
    }
  }

  onKeydown(e) {
    if (!this.onTop) return;
    if (this.opts.closeOnEsc && e.key == 'Escape') this.close();
    this.opts.onKeydown && this.opts.onKeydown(e);
  }

  get hash() {
    return this.route && this.route.state.props.hash;
  }

  get route() {
    return this.__route;
  }

  set route(route) {
    if (this.route) {
      return console.warn('Panel routes can only be set once');
    }

    this.__route = route instanceof _router.Route ? route : new _router.Route(route, this._routeChange.bind(this));
  }

  _routeChange(oldState, newState, dir) {
    // console.log(this.title, dir);
    let detail = {
      oldState: oldState,
      newState: newState
    };

    if (newState) {
      newState.update({
        title: this.title
      });
      if (!this.isOpen && dir == 'forward') newState.update({
        didEnter: true
      });
      this.open();
      detail.opened = true;
    }

    if (oldState && !newState) {
      if (oldState.isAfter && oldState.props.didEnter || oldState.isBefore && oldState.props.didExit) {
        this._close();

        detail.closed = true;
      } // if( (oldState.isBefore && oldState.props.didEnter)
      // || (oldState.isAfter && oldState.props.didExit) )
      //     this.open()

    }

    if (oldState && newState) {// console.log('same view, but new state', newState.params);
      // if( this.view && this.view.onOpen ){
      //     this.view.onOpen(this.route.state)
      // }
    }

    this.dispatchEvent(new CustomEvent('route-changed', {
      bubbles: true,
      composed: true,
      detail: detail
    }));
  }

  render() {
    return _litElement.html`
        <div class="backdrop"></div>
        <main style="width:${this.width}; height:${this.height}">
            <b-btn icon="cancel-1" pill class="modal-close-btn" @click=${this.close} ?hidden=${this.closeBtn !== true}></b-btn>
            <slot></slot>
            ${this.html}
        </main>
    `;
  }

  animate(effect) {
    if (!effect) return;
    let main = this.shadowRoot.querySelector('main');
    main.classList.add(effect);
    setTimeout(function () {
      main.classList.remove(effect);
    }, 1000);
  }

  bounce() {
    this.animate('bounce');
  }

  shake() {
    this.animate('shake');
  }

  set html(fn) {
    this.__html = fn;
  }

  get html() {
    return this.__html ? this.__html.call(this) : '';
  }

  set view(view) {
    if (this.view) {
      this.view.panel = null;
      this.view.remove();
    }

    if (this.toolbar) {
      this.toolbar.panel = null;
      this.toolbar = null;
    }

    this.__view = view;

    if (this.view) {
      this.view.panel = this;
      this.appendChild(this.view);

      this._linkToolbar();
    }
  }

  get view() {
    return this.__view;
  }

  get isOpen() {
    return this.hasAttribute('open');
  }

  get onTop() {
    return this.hasAttribute('ontop') || this.type == 'modal' && this.parentElement.lastElementChild == this;
  }

  firstUpdated() {
    this._linkToolbar();

    this.shadowRoot.addEventListener('click', e => {
      if (!e.target.classList.contains('backdrop')) return;
      if (this.opts.onBackdropClick && this.opts.onBackdropClick() === false) return;
      if (this.opts.disableBackdropClick !== true) this.close();
    }, true);
  }

  _linkToolbar() {
    setTimeout(() => {
      if (this.view && this.view.shadowRoot) this.toolbar = this.view.shadowRoot.querySelector('b-panel-toolbar');else this.toolbar = this.shadowRoot.querySelector('b-panel-toolbar') || this.querySelector('b-panel-toolbar');

      if (this.toolbar) {
        this.toolbar.panel = this;
        this.toolbar.title = this.title;
      }
    }, 0);
  }

  get panelController() {
    return this.__panelController;
  }

  set controller(val) {
    this.panelController = val;
  }

  set panelController(val) {
    if (typeof val === 'string') {
      let _val = val;
      val = _controller.default.for(val);
      if (!val) console.warn('Panel controller `' + _val + '` does not exist, root will be used');
    }

    this.__panelController = val;
  }

  open() {
    if (this.route && this.route.state.props.controller) this.controller = this.route.state.props.controller; // if no controller set, use the root controller

    if (!this.panelController) {
      this.panelController = _controller.default.for('root');
    }

    this._onKeydown = this._onKeydown || this.onKeydown.bind(this);
    window.removeEventListener('keydown', this._onKeydown, true);
    window.addEventListener('keydown', this._onKeydown, true);
    this.panelController.add(this);
    setTimeout(() => {
      this.setAttribute('open', '');

      if (this.view && this.view.onOpen) {
        this.view.onOpen(this.route.state);
      }
    }, 100);
    return this;
  }

  set title(str) {
    this.__title = str;
    this.route && this.route.update({
      title: str
    });
  }

  get title() {
    return this.__title;
  }

  get params() {
    return this.route ? this.route.state.params : {};
  }

  close() {
    if (this.opts.onClose && this.opts.onClose() === false) return;
    this.route && this.route.update({
      didExit: true
    });

    this._close();

    if (this.route) this.panelController._updateRoute();
    return this;
  }

  _close() {
    window.removeEventListener('keydown', this._onKeydown, true);
    this.panelController.remove(this);
    this.removeAttribute('open');
    setTimeout(() => {
      this.remove();
    }, Panel.animationTime);
  }

  static get styles() {
    return _litElement.css`
        :host {
            pointer-events: initial;
            display: flex;
            position: absolute;
            overflow: visible;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,.4); /* overlay */
            opacity: 0;
            transition: opacity ${Panel.animationTime}ms cubic-bezier(0.4, 0, 0.2, 1),
                        background-color ${Panel.animationTime}ms cubic-bezier(0.4, 0, 0.2, 1);
            --radius: 5px;
        }

        :host([type="modal"]) {
            z-index: 1000; /* always on top */
        }

        :host > main {
            position: absolute;
            right: 0;
            min-width: 300px;
            min-height: 1em;
            max-width: 100%;
            max-height: 100%;
            overflow: visible;
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #fff;
            box-shadow: rgba(0,0,0,.2) 0 3px 10px;
            border-radius: var(--radius) var(--radius) 0 0px;
            transition: ${Panel.animationTime}ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        :host([open]) {
            opacity: 1;
        }

        :host([open]) > main {
            opacity: 1;
            transform: none !important;
        }

        :host([anchor="right"]) > main {
            transform: translateX(100px);
        }

        :host([anchor="left"]) > main {
            right: auto;
            left: 0;
            transform: translateX(-100px);
        }

        :host([anchor="center"]) > main,
        :host([anchor="top"]) > main,
        :host([anchor="bottom"]) > main {
            position: relative;
            margin: auto auto;
            transform: translateY(100px);
        }

        :host([anchor="center"]) > main {
            border-radius: var(--radius);
        }

        :host([anchor="center"][animation="scale"]) > main {
            transform: scale(.5);
        }

        :host([anchor="top"]) > main {
            margin-top: 0;
            transform: translateY(-100px);
            border-radius: 0 0 var(--radius) var(--radius);
        }

        :host([anchor="bottom"]) > main {
            margin-bottom: 0;
        }

        .backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .modal-close-btn {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 10000;
            transform: translate(50%, -50%);
        }

        main > slot::slotted(*) {
            width: 100%;
            /* display: grid;
            grid-template-rows: auto 1fr; */
        }

        main > slot::slotted(.dialog) {
            font-size: 1.1em;
        }

        main > slot::slotted(b-embed) {
            border-radius: var(--radius);
            overflow: hidden;
        }

        main {
            display: grid;
        }

        main > section {
            padding: 1em;
        }

        @media print {
            :host {
                background: none;
                position: static;
            }

            :host(:not([ontop])) {
                display: none !important;
            }

            :host > main {
                width: 100% !important;
                border-radius: 0;
                box-shadow: none;
            }
        }

        @keyframes bounce {
            from,
            20%,
            53%,
            80%,
            to {
                -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
                animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }

            40%,
            43% {
                -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
                animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
                -webkit-transform: translate3d(0, -30px, 0);
                transform: translate3d(0, -30px, 0);
            }

            70% {
                -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
                animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
                -webkit-transform: translate3d(0, -15px, 0);
                transform: translate3d(0, -15px, 0);
            }

            90% {
                -webkit-transform: translate3d(0, -4px, 0);
                transform: translate3d(0, -4px, 0);
            }
        }

        @keyframes shake {
            from,
            to {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }

            15%,
            45%,
            75% {
                -webkit-transform: translate3d(-10px, 0, 0);
                transform: translate3d(-10px, 0, 0);
            }

            30%,
            60%,
            90% {
                -webkit-transform: translate3d(10px, 0, 0);
                transform: translate3d(10px, 0, 0);
            }
        }

        .bounce {
            animation-name: bounce;
            transform-origin: center bottom;
            animation-duration: 1s;
            animation-fill-mode: both;
        }

        .shake {
            animation-name: shake;
            animation-duration: 700ms;
            animation-fill-mode: both;
        }
    `;
  }

}

exports.Panel = Panel;
customElements.define('b-panel', Panel);

var _default = customElements.get('b-panel');

exports.default = _default;
},{"lit-element":"+bhx","./controller":"R9Fe","../../router":"38Qe","./toolbar":"ZNP1","../../elements/btn":"DABr"}],"Wp9p":[function(require,module,exports) {
var define;
/*!
 * Fuse.js v3.4.5 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function (e, t) {
  "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("Fuse", [], t) : "object" == typeof exports ? exports.Fuse = t() : e.Fuse = t();
}(this, function () {
  return function (e) {
    var t = {};

    function n(r) {
      if (t[r]) return t[r].exports;
      var o = t[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }

    return n.m = e, n.c = t, n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: r
      });
    }, n.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, n.t = function (e, t) {
      if (1 & t && (e = n(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var o in e) n.d(r, o, function (t) {
        return e[t];
      }.bind(null, o));
      return r;
    }, n.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };
      return n.d(t, "a", t), t;
    }, n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, n.p = "", n(n.s = 1);
  }([function (e, t) {
    e.exports = function (e) {
      return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e);
    };
  }, function (e, t, n) {
    function r(e) {
      return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      })(e);
    }

    function o(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }

    var i = n(2),
        a = n(8),
        s = n(0),
        c = function () {
      function e(t, n) {
        var r = n.location,
            o = void 0 === r ? 0 : r,
            i = n.distance,
            s = void 0 === i ? 100 : i,
            c = n.threshold,
            h = void 0 === c ? .6 : c,
            l = n.maxPatternLength,
            u = void 0 === l ? 32 : l,
            f = n.caseSensitive,
            d = void 0 !== f && f,
            v = n.tokenSeparator,
            p = void 0 === v ? / +/g : v,
            g = n.findAllMatches,
            y = void 0 !== g && g,
            m = n.minMatchCharLength,
            k = void 0 === m ? 1 : m,
            S = n.id,
            x = void 0 === S ? null : S,
            b = n.keys,
            M = void 0 === b ? [] : b,
            _ = n.shouldSort,
            L = void 0 === _ || _,
            w = n.getFn,
            A = void 0 === w ? a : w,
            C = n.sortFn,
            I = void 0 === C ? function (e, t) {
          return e.score - t.score;
        } : C,
            O = n.tokenize,
            j = void 0 !== O && O,
            P = n.matchAllTokens,
            F = void 0 !== P && P,
            T = n.includeMatches,
            z = void 0 !== T && T,
            E = n.includeScore,
            K = void 0 !== E && E,
            $ = n.verbose,
            J = void 0 !== $ && $;
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e), this.options = {
          location: o,
          distance: s,
          threshold: h,
          maxPatternLength: u,
          isCaseSensitive: d,
          tokenSeparator: p,
          findAllMatches: y,
          minMatchCharLength: k,
          id: x,
          keys: M,
          includeMatches: z,
          includeScore: K,
          shouldSort: L,
          getFn: A,
          sortFn: I,
          verbose: J,
          tokenize: j,
          matchAllTokens: F
        }, this.setCollection(t);
      }

      var t, n, c;
      return t = e, (n = [{
        key: "setCollection",
        value: function (e) {
          return this.list = e, e;
        }
      }, {
        key: "search",
        value: function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
            limit: !1
          };

          this._log('---------\nSearch pattern: "'.concat(e, '"'));

          var n = this._prepareSearchers(e),
              r = n.tokenSearchers,
              o = n.fullSearcher,
              i = this._search(r, o),
              a = i.weights,
              s = i.results;

          return this._computeScore(a, s), this.options.shouldSort && this._sort(s), t.limit && "number" == typeof t.limit && (s = s.slice(0, t.limit)), this._format(s);
        }
      }, {
        key: "_prepareSearchers",
        value: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
              t = [];
          if (this.options.tokenize) for (var n = e.split(this.options.tokenSeparator), r = 0, o = n.length; r < o; r += 1) t.push(new i(n[r], this.options));
          return {
            tokenSearchers: t,
            fullSearcher: new i(e, this.options)
          };
        }
      }, {
        key: "_search",
        value: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
              t = arguments.length > 1 ? arguments[1] : void 0,
              n = this.list,
              r = {},
              o = [];

          if ("string" == typeof n[0]) {
            for (var i = 0, a = n.length; i < a; i += 1) this._analyze({
              key: "",
              value: n[i],
              record: i,
              index: i
            }, {
              resultMap: r,
              results: o,
              tokenSearchers: e,
              fullSearcher: t
            });

            return {
              weights: null,
              results: o
            };
          }

          for (var s = {}, c = 0, h = n.length; c < h; c += 1) for (var l = n[c], u = 0, f = this.options.keys.length; u < f; u += 1) {
            var d = this.options.keys[u];

            if ("string" != typeof d) {
              if (s[d.name] = {
                weight: 1 - d.weight || 1
              }, d.weight <= 0 || d.weight > 1) throw new Error("Key weight has to be > 0 and <= 1");
              d = d.name;
            } else s[d] = {
              weight: 1
            };

            this._analyze({
              key: d,
              value: this.options.getFn(l, d),
              record: l,
              index: c
            }, {
              resultMap: r,
              results: o,
              tokenSearchers: e,
              fullSearcher: t
            });
          }

          return {
            weights: s,
            results: o
          };
        }
      }, {
        key: "_analyze",
        value: function (e, t) {
          var n = e.key,
              r = e.arrayIndex,
              o = void 0 === r ? -1 : r,
              i = e.value,
              a = e.record,
              c = e.index,
              h = t.tokenSearchers,
              l = void 0 === h ? [] : h,
              u = t.fullSearcher,
              f = void 0 === u ? [] : u,
              d = t.resultMap,
              v = void 0 === d ? {} : d,
              p = t.results,
              g = void 0 === p ? [] : p;

          if (null != i) {
            var y = !1,
                m = -1,
                k = 0;

            if ("string" == typeof i) {
              this._log("\nKey: ".concat("" === n ? "-" : n));

              var S = f.search(i);

              if (this._log('Full text: "'.concat(i, '", score: ').concat(S.score)), this.options.tokenize) {
                for (var x = i.split(this.options.tokenSeparator), b = [], M = 0; M < l.length; M += 1) {
                  var _ = l[M];

                  this._log('\nPattern: "'.concat(_.pattern, '"'));

                  for (var L = !1, w = 0; w < x.length; w += 1) {
                    var A = x[w],
                        C = _.search(A),
                        I = {};

                    C.isMatch ? (I[A] = C.score, y = !0, L = !0, b.push(C.score)) : (I[A] = 1, this.options.matchAllTokens || b.push(1)), this._log('Token: "'.concat(A, '", score: ').concat(I[A]));
                  }

                  L && (k += 1);
                }

                m = b[0];

                for (var O = b.length, j = 1; j < O; j += 1) m += b[j];

                m /= O, this._log("Token score average:", m);
              }

              var P = S.score;
              m > -1 && (P = (P + m) / 2), this._log("Score average:", P);
              var F = !this.options.tokenize || !this.options.matchAllTokens || k >= l.length;

              if (this._log("\nCheck Matches: ".concat(F)), (y || S.isMatch) && F) {
                var T = v[c];
                T ? T.output.push({
                  key: n,
                  arrayIndex: o,
                  value: i,
                  score: P,
                  matchedIndices: S.matchedIndices
                }) : (v[c] = {
                  item: a,
                  output: [{
                    key: n,
                    arrayIndex: o,
                    value: i,
                    score: P,
                    matchedIndices: S.matchedIndices
                  }]
                }, g.push(v[c]));
              }
            } else if (s(i)) for (var z = 0, E = i.length; z < E; z += 1) this._analyze({
              key: n,
              arrayIndex: z,
              value: i[z],
              record: a,
              index: c
            }, {
              resultMap: v,
              results: g,
              tokenSearchers: l,
              fullSearcher: f
            });
          }
        }
      }, {
        key: "_computeScore",
        value: function (e, t) {
          this._log("\n\nComputing score:\n");

          for (var n = 0, r = t.length; n < r; n += 1) {
            for (var o = t[n].output, i = o.length, a = 1, s = 1, c = 0; c < i; c += 1) {
              var h = e ? e[o[c].key].weight : 1,
                  l = (1 === h ? o[c].score : o[c].score || .001) * h;
              1 !== h ? s = Math.min(s, l) : (o[c].nScore = l, a *= l);
            }

            t[n].score = 1 === s ? a : s, this._log(t[n]);
          }
        }
      }, {
        key: "_sort",
        value: function (e) {
          this._log("\n\nSorting...."), e.sort(this.options.sortFn);
        }
      }, {
        key: "_format",
        value: function (e) {
          var t = [];

          if (this.options.verbose) {
            var n = [];
            this._log("\n\nOutput:\n\n", JSON.stringify(e, function (e, t) {
              if ("object" === r(t) && null !== t) {
                if (-1 !== n.indexOf(t)) return;
                n.push(t);
              }

              return t;
            })), n = null;
          }

          var o = [];
          this.options.includeMatches && o.push(function (e, t) {
            var n = e.output;
            t.matches = [];

            for (var r = 0, o = n.length; r < o; r += 1) {
              var i = n[r];

              if (0 !== i.matchedIndices.length) {
                var a = {
                  indices: i.matchedIndices,
                  value: i.value
                };
                i.key && (a.key = i.key), i.hasOwnProperty("arrayIndex") && i.arrayIndex > -1 && (a.arrayIndex = i.arrayIndex), t.matches.push(a);
              }
            }
          }), this.options.includeScore && o.push(function (e, t) {
            t.score = e.score;
          });

          for (var i = 0, a = e.length; i < a; i += 1) {
            var s = e[i];

            if (this.options.id && (s.item = this.options.getFn(s.item, this.options.id)[0]), o.length) {
              for (var c = {
                item: s.item
              }, h = 0, l = o.length; h < l; h += 1) o[h](s, c);

              t.push(c);
            } else t.push(s.item);
          }

          return t;
        }
      }, {
        key: "_log",
        value: function () {
          var e;
          this.options.verbose && (e = console).log.apply(e, arguments);
        }
      }]) && o(t.prototype, n), c && o(t, c), e;
    }();

    e.exports = c;
  }, function (e, t, n) {
    function r(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }

    var o = n(3),
        i = n(4),
        a = n(7),
        s = function () {
      function e(t, n) {
        var r = n.location,
            o = void 0 === r ? 0 : r,
            i = n.distance,
            s = void 0 === i ? 100 : i,
            c = n.threshold,
            h = void 0 === c ? .6 : c,
            l = n.maxPatternLength,
            u = void 0 === l ? 32 : l,
            f = n.isCaseSensitive,
            d = void 0 !== f && f,
            v = n.tokenSeparator,
            p = void 0 === v ? / +/g : v,
            g = n.findAllMatches,
            y = void 0 !== g && g,
            m = n.minMatchCharLength,
            k = void 0 === m ? 1 : m;
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e), this.options = {
          location: o,
          distance: s,
          threshold: h,
          maxPatternLength: u,
          isCaseSensitive: d,
          tokenSeparator: p,
          findAllMatches: y,
          minMatchCharLength: k
        }, this.pattern = this.options.isCaseSensitive ? t : t.toLowerCase(), this.pattern.length <= u && (this.patternAlphabet = a(this.pattern));
      }

      var t, n, s;
      return t = e, (n = [{
        key: "search",
        value: function (e) {
          if (this.options.isCaseSensitive || (e = e.toLowerCase()), this.pattern === e) return {
            isMatch: !0,
            score: 0,
            matchedIndices: [[0, e.length - 1]]
          };
          var t = this.options,
              n = t.maxPatternLength,
              r = t.tokenSeparator;
          if (this.pattern.length > n) return o(e, this.pattern, r);
          var a = this.options,
              s = a.location,
              c = a.distance,
              h = a.threshold,
              l = a.findAllMatches,
              u = a.minMatchCharLength;
          return i(e, this.pattern, this.patternAlphabet, {
            location: s,
            distance: c,
            threshold: h,
            findAllMatches: l,
            minMatchCharLength: u
          });
        }
      }]) && r(t.prototype, n), s && r(t, s), e;
    }();

    e.exports = s;
  }, function (e, t) {
    var n = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

    e.exports = function (e, t) {
      var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : / +/g,
          o = new RegExp(t.replace(n, "\\$&").replace(r, "|")),
          i = e.match(o),
          a = !!i,
          s = [];
      if (a) for (var c = 0, h = i.length; c < h; c += 1) {
        var l = i[c];
        s.push([e.indexOf(l), l.length - 1]);
      }
      return {
        score: a ? .5 : 1,
        isMatch: a,
        matchedIndices: s
      };
    };
  }, function (e, t, n) {
    var r = n(5),
        o = n(6);

    e.exports = function (e, t, n, i) {
      for (var a = i.location, s = void 0 === a ? 0 : a, c = i.distance, h = void 0 === c ? 100 : c, l = i.threshold, u = void 0 === l ? .6 : l, f = i.findAllMatches, d = void 0 !== f && f, v = i.minMatchCharLength, p = void 0 === v ? 1 : v, g = s, y = e.length, m = u, k = e.indexOf(t, g), S = t.length, x = [], b = 0; b < y; b += 1) x[b] = 0;

      if (-1 !== k) {
        var M = r(t, {
          errors: 0,
          currentLocation: k,
          expectedLocation: g,
          distance: h
        });

        if (m = Math.min(M, m), -1 !== (k = e.lastIndexOf(t, g + S))) {
          var _ = r(t, {
            errors: 0,
            currentLocation: k,
            expectedLocation: g,
            distance: h
          });

          m = Math.min(_, m);
        }
      }

      k = -1;

      for (var L = [], w = 1, A = S + y, C = 1 << S - 1, I = 0; I < S; I += 1) {
        for (var O = 0, j = A; O < j;) {
          r(t, {
            errors: I,
            currentLocation: g + j,
            expectedLocation: g,
            distance: h
          }) <= m ? O = j : A = j, j = Math.floor((A - O) / 2 + O);
        }

        A = j;
        var P = Math.max(1, g - j + 1),
            F = d ? y : Math.min(g + j, y) + S,
            T = Array(F + 2);
        T[F + 1] = (1 << I) - 1;

        for (var z = F; z >= P; z -= 1) {
          var E = z - 1,
              K = n[e.charAt(E)];

          if (K && (x[E] = 1), T[z] = (T[z + 1] << 1 | 1) & K, 0 !== I && (T[z] |= (L[z + 1] | L[z]) << 1 | 1 | L[z + 1]), T[z] & C && (w = r(t, {
            errors: I,
            currentLocation: E,
            expectedLocation: g,
            distance: h
          })) <= m) {
            if (m = w, (k = E) <= g) break;
            P = Math.max(1, 2 * g - k);
          }
        }

        if (r(t, {
          errors: I + 1,
          currentLocation: g,
          expectedLocation: g,
          distance: h
        }) > m) break;
        L = T;
      }

      return {
        isMatch: k >= 0,
        score: 0 === w ? .001 : w,
        matchedIndices: o(x, p)
      };
    };
  }, function (e, t) {
    e.exports = function (e, t) {
      var n = t.errors,
          r = void 0 === n ? 0 : n,
          o = t.currentLocation,
          i = void 0 === o ? 0 : o,
          a = t.expectedLocation,
          s = void 0 === a ? 0 : a,
          c = t.distance,
          h = void 0 === c ? 100 : c,
          l = r / e.length,
          u = Math.abs(s - i);
      return h ? l + u / h : u ? 1 : l;
    };
  }, function (e, t) {
    e.exports = function () {
      for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, n = [], r = -1, o = -1, i = 0, a = e.length; i < a; i += 1) {
        var s = e[i];
        s && -1 === r ? r = i : s || -1 === r || ((o = i - 1) - r + 1 >= t && n.push([r, o]), r = -1);
      }

      return e[i - 1] && i - r >= t && n.push([r, i - 1]), n;
    };
  }, function (e, t) {
    e.exports = function (e) {
      for (var t = {}, n = e.length, r = 0; r < n; r += 1) t[e.charAt(r)] = 0;

      for (var o = 0; o < n; o += 1) t[e.charAt(o)] |= 1 << n - o - 1;

      return t;
    };
  }, function (e, t, n) {
    var r = n(0);

    e.exports = function (e, t) {
      return function e(t, n, o) {
        if (n) {
          var i = n.indexOf("."),
              a = n,
              s = null;
          -1 !== i && (a = n.slice(0, i), s = n.slice(i + 1));
          var c = t[a];
          if (null != c) if (s || "string" != typeof c && "number" != typeof c) {
            if (r(c)) for (var h = 0, l = c.length; h < l; h += 1) e(c[h], s, o);else s && e(c, s, o);
          } else o.push(c.toString());
        } else o.push(t);

        return o;
      }(e, t, []);
    };
  }]);
});
},{}],"jNfL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

const styles = _litElement.css`

:host {
	--size: 1.6em;
	--color: #2196f3;
	--colorDisabled: rgba(0, 0, 0, 0.26);
	display: inline-block;
	vertical-align: middle;
	flex-grow: 0 !important;
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	outline: none;
}

:host([checked]) svg.uncheck,
:host(:not([checked])) svg.check {
	display: none
}

main {
	position: relative;
}

:host([placement="top"]) { flex-direction: column-reverse; }
:host([placement="bottom"]) { flex-direction: column; }
:host([placement="left"]) { flex-direction: row-reverse; }
:host([placement="right"]) { flex-direction: row; }

svg {
	fill: currentColor;
	width: var(--size);
	height: var(--size);
	display: inline-block;
	transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	user-select: none;
	flex-shrink: 0;
	padding: .25em;
}

.switch {
	display: none
}

:host([type="switch"]) svg { display: none; }

:host([type="switch"]) .switch {
	display: inline-block;
}

:host([checked]) {
	color: var(--color)
}

:host([disabled]) svg {
	fill: var(--colorDisabled)
}

:host([disabled]) label {
	color: var(--colorDisabled);
}

main label {
	cursor: pointer;
}

.indeterminate {
	display: none;
}

.switch {
	position: relative;
	align-items: center;
	margin: .5em;
}

.switch:before, .switch:after {
	content: "";
	margin: 0;
	outline: 0;
	transition: all 0.3s ease;
}

.switch:before {
	display: block;
	width: 2em;
	height: 1em;
	background-color: #9E9E9E;
	border-radius: 1em;
}

.switch:after {
	position: absolute;
	left: 0;
	top: 50%;
	transform: translate(0, -50%);
	width: 1.3em;
	height: 1.3em;
	background-color: #FAFAFA;
	border-radius: 50%;
	box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
}


:host([checked]) .switch:before {
	background-color: var(--color);
	opacity: .5
}

:host([checked]) .switch:after {
	background-color: var(--color);
	transform: translate(80%, -50%);
}
`;

class CheckBoxElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    let label = this.getAttribute('label') || '<slot name="label"></slot>';
    temp.innerHTML = `
			<style>
			${styles.cssText}
			</style>
			<main>
				<svg class="uncheck" focusable="false" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>
				<svg class="check" focusable="false" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
				<div class="switch"></div>
				<touch-ripple><touch-ripple>
			</main>
			<label>${label}</label>
			`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    this.ripple = this.shadowRoot.querySelector('touch-ripple');
    this.addEventListener('click', this._onClick.bind(this));
    this.addEventListener('keydown', e => {
      if (['Space', 'Enter'].includes(e.code)) this._onClick();
    });
    this.addEventListener('focus', e => {
      if (e.relatedTarget && e.relatedTarget != this) this.ripple.enter();
    });
    this.addEventListener('blur', e => {
      if (e.relatedTarget && e.relatedTarget != this) this.ripple.hide();
    });
  }

  connectedCallback() {
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
  }

  _onClick() {
    if (this.disabled) return;
    this.ripple.ripple();
    this.checked = !this.checked;
    var event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.checked
      }
    });
    this.dispatchEvent(event); // this.blur()
  }

  set checked(val) {
    if (val === '0' || val === '') val = false;
    val ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  get value() {
    return this.checked;
  }

  set value(val) {
    this.checked = val;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val = true) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

}

customElements.define('check-box', CheckBoxElement);

var _default = customElements.get('check-box');

exports.default = _default;
},{"lit-element":"+bhx"}],"0tCY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DefaultOpts = void 0;

var _litHtml = require("lit-html");

var _unsafeHtml = require("lit-html/directives/unsafe-html");

var _popover = _interopRequireDefault(require("../popover"));

var _panel = _interopRequireDefault(require("../panel"));

var _fuse = _interopRequireDefault(require("fuse.js"));

require("../form-control/controls/check-box");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DefaultOpts = {
  selected: false,
  multiple: false,
  search: 20,
  // true (always show) or number of results for it to show
  minW: false,
  width: null,
  jumpNav: false,
  // true (always show) or number of results for it to show
  typeDelay: 700,
  // how long until typed characters reset
  hasMenuIcon: 'right-open',
  onSelect: () => {}
};
exports.DefaultOpts = DefaultOpts;
const SearchDefaults = {
  placeholder: 'Search',
  parse: row => {
    return {
      label: row.label || row.name || row.title || 'Unknown',
      val: row.val || row.id || null,
      description: row.description || ''
    };
  }
};

const styles = require('./style.less');

class Menu {
  constructor(menu = [], opts = {}) {
    this.el = document.createElement('div');
    this.el.classList.add('b-menu');
    this.el.classList.add('nopadding');
    if (opts.className) opts.className.split(' ').forEach(cn => {
      this.el.classList.add(cn.trim());
    });
    this.opts = Object.assign({}, DefaultOpts, opts);
    this.menu = menu;
    if (opts.multiple == undefined && this.opts.selected instanceof Array) this.opts.multiple = true;
    let selected = this.opts.selected || [];
    if (Array.isArray(selected)) selected = selected.slice(0); // clone

    this.selected = selected;
    if (this.opts.minW) this.el.style.minWidth = this.opts.minW;
    if (this.opts.width) this.el.style.width = this.opts.width;
    this.el.addEventListener('click', this.onClick.bind(this));
    this.promise = new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  set menu(menu) {
    if (typeof menu == 'function') menu = menu();
    this.__menu = menu;
    if (this.searchUrl && !this.__origMenu) this.__origMenu = menu || [];
    if (!this.searchUrl) this.__fuse = new _fuse.default(this.__menu, {
      keys: [{
        name: 'dataTitle',
        weight: 0.7
      }, {
        name: 'label',
        weight: 0.5
      }, {
        name: 'description',
        weight: 0.3
      }],
      minMatchCharLength: 3,
      threshold: 0.4,
      location: 0,
      distance: 300
    });
  }

  get menu() {
    return this.__menu || [];
  }

  get displayMenu() {
    if (this.__filteredMenu) return this.__filteredMenu;
    if (this.searchIsOn && !this.searchShouldShowAll) return [];
    if (this.searchIsOn && this.hideUnselected) return this.menu.filter(m => m.label === undefined || m.selected);
    return this.menu;
  }

  set selected(keys) {
    // always store selected values as an array
    if (!Array.isArray(keys)) keys = [keys]; // store selected values as the actual values (not just the keys)

    this.__selected = this.menu.filter(m => {
      // select/deselect each value
      if (m.val !== undefined && keys.includes(m.val)) m.selected = true;else {
        delete m.selected;
      }
      return m.selected;
    }); // keep values in the order that they were selected

    this.__selected = this.__selected.sort((a, b) => {
      return keys.indexOf(a.val) - keys.indexOf(b.val);
    });
  }

  get selected() {
    return this.opts.multiple ? this.__selected : this.__selected[0];
  }

  toggleSelected(item) {
    let index = this.__selected.indexOf(item);

    if (index > -1) {
      item.selected = false;

      this.__selected.splice(index, 1);

      return false;
    } else {
      item.selected = true;

      this.__selected.push(item);

      return true;
    }
  }

  focusSearch() {
    let input = this.el.querySelector('.menu-search-bar input');
    input && input.focus();
  }

  get searchIsOn() {
    let s = this.opts.search;
    return s === true || typeof s == 'object' || typeof s == 'number' && this.menu.length >= s;
  }

  get searchUrl() {
    return this.opts.search && this.opts.search.url;
  }

  get searchShouldShowAll() {
    return this.opts.search && this.opts.search.showAll !== false;
  }

  get hideUnselected() {
    return this.opts.search && this.opts.search.hideUnselected === true;
  }

  get searchParse() {
    let parse = this.opts.search && this.opts.search.parse;
    if (typeof parse !== 'function') parse = SearchDefaults.parse;
    return parse;
  }

  get searchPlaceholder() {
    return this.opts.search && this.opts.search.placeholder || SearchDefaults.placeholder;
  }

  get searchSpinner() {
    return this.__searchSpinner = this.__searchSpinner || this.el.querySelector('.menu-search-bar b-spinner');
  }

  async fetchResults(term) {
    // already in process of looking up this term
    if (this._fetchingTerm === term) return;
    this._fetchingTerm = term;
    let url = this.searchUrl; // URL can be a dynamic function

    if (typeof url == 'function') url = url(term);else url += term;
    this.searchSpinner.hidden = false;
    let resp = await fetch(url).then(resp => resp.json()); // looks like we started searching for another term before we got
    // this response back, so ignore the results

    if (this._fetchingTerm !== term) return; // parse the search results to fit the expected "menu" structure

    if (Array.isArray(resp)) this.menu = resp.map(row => this.searchParse(row));else this.menu = [];
    this._fetchingTerm = null;
    this.searchSpinner.hidden = true;
    this.render(); // update popover position

    if (this.presenter && this.presenter._updatePosition) this.presenter._updatePosition();
  }

  appendTo(el) {
    el.appendElement(this.el);
    this.render();
  }

  render() {
    let showJumpNav = this.opts.jumpNav === true || typeof this.opts.jumpNav == 'number' && this.displayMenu.length >= this.opts.jumpNav;
    this._active = null;
    (0, _litHtml.render)(_litHtml.html`

			${this.searchIsOn ? _litHtml.html`
				<div class="menu-search-bar">
					<b-icon name="search"></b-icon>
					<b-spinner hidden></b-spinner>
					<input type="text" placeholder="${this.searchPlaceholder}">
				</div>
			` : ''}

			<div class="results">
				
				${showJumpNav ? _litHtml.html`
					<alphabet-jump-nav>
						<span style="color: red">'alphabet-jump-nav' custom element not loaded</span>
					</alphabet-jump-nav>` : ''}

				${this.displayMenu.map((m, i) => this.renderItem(m, i))}
			</div>

		`, this.el);
    return this;
  }

  renderItem(m, i) {
    if (m == 'divider' || m.label == 'divider' && m.val == 'divider') return _litHtml.html`<b-hr></b-hr>`;
    if (m.divider) return _litHtml.html`<div class="menu-divider">${m.divider}</div>`;
    if (m.text) return _litHtml.html`<div class="menu-text">${m.text}</div>`;
    if (m.title) return _litHtml.html`<div class="menu-title"><h2>${m.title}</h2></div>`; // capture menu item index for use in resolve (if so desired)

    m.index = i;
    let icon = m.icon ? _litHtml.html`<b-icon name="${m.icon}"></b-icon>` : '';
    let checkbox = this.opts.multiple && !m.clearsAll || m.selected ? _litHtml.html`<check-box ?checked=${m.selected}></check-box>` : '';
    let menuIcon = m.menu && this.opts.hasMenuIcon ? _litHtml.html`<b-icon class="has-menu" name="${this.opts.hasMenuIcon}"></b-icon>` : '';
    if (m.attrs && typeof m.attrs == 'object') console.warn('`attrs` unsupported right now'); // TODO: support this some how?
    // if( m.attrs && typeof m.attrs == 'object' ){
    // 	for(let key in m.attrs)
    // 		el.setAttribute(key, m.attrs[key])
    // }

    let extras = '';

    if (m.extras) {
      extras = m.extras.filter(elName => customElements.get(elName)).map(elName => {
        let el = document.createElement(elName);
        el.item = m;
        el.classList.add('menu-item-extra');
        return el;
      });
    }

    let dataTitle = (m.dataTitle || m.label + ' ' + m.description).trim().toLowerCase();
    return _litHtml.html`
			<div class="menu-item ${m.className}" val=${m.val} index=${i}
				data-title=${dataTitle}
				?icon-only=${!m.label && !m.description} ?selected=${m.selected}>
				${checkbox}
				${icon}
				${m.view && m.view instanceof HTMLElement ? m.view : _litHtml.html`
					<span class="mi-content">
						<div class="mi-label">${(0, _unsafeHtml.unsafeHTML)(m.label || '')}</div>
						<div class="mi-description">${(0, _unsafeHtml.unsafeHTML)(m.description || '')}</div>
					</span>
				`}
				${extras}
				${menuIcon}
			</div>
		`;
  }

  onClick(e) {
    let target = e.target;
    let didClickCheckbox = target.tagName == 'CHECK-BOX';

    while (target && !target.classList.contains('menu-item')) {
      target = target.parentElement;
    }

    if (target) {
      let data = this.displayMenu[target.getAttribute('index')];
      if (data.menu) return this._itemMenu(target, data);

      if (this.opts.multiple) {
        if (this.opts.multiple !== 'always' && (data.clearsAll || !didClickCheckbox)) {
          return this.resolve([data]);
        }

        let isSelected = this.toggleSelected(data);
        if (this.searchIsOn && this.hideUnselected) this.render();else if (isSelected) {
          target.classList.add('selected');
          target.querySelector('check-box').checked = true;
        } else {
          target.classList.remove('selected');
          target.querySelector('check-box').checked = false;
        }
        this.opts.onSelect && this.opts.onSelect(this.selected);
      } else {
        this.resolve(data);
      }
    }
  }

  async _itemMenu(target, data) {
    let menu = new Menu(data.menu, data.menuOpts || {});
    let popoverOpts = data.menuOpts && data.menuOpts.popover || {};
    let val = await menu.popover(target, popoverOpts);

    if (val) {
      data.menuSelected = val;
      this.resolve(data);
    }
  }

  onKeydown(e) {
    if (e.which >= 65 && e.which <= 90 || // a-z
    e.which >= 48 && e.which <= 57 // 0-9
    || [8].includes(e.which)) {
      // delete
      this.onLetterPress(e);
      return;
    }

    if (e.code == 'Escape') {
      this.resolve(false);
      return;
    }

    if (e.target.tagName == 'INPUT' && ['ArrowLeft', 'ArrowRight'].includes(e.code)) return;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.code)) return;
    let items = this.el.querySelectorAll('.menu-item');
    let activeItem = items[this._active]; // if active item has a menu open, dont perform any actions

    if (activeItem && activeItem.classList.contains('popover-open')) return;

    if (e.code == 'Enter') {
      if (activeItem) activeItem.click();
      return;
    }

    if (this._active == null) this._active = -1;
    this._active += ['ArrowUp', 'ArrowLeft'].includes(e.code) ? -1 : 1;
    if (this._active < 0) this._active = items.length - 1;
    if (this._active >= items.length) this._active = 0;
    this.setActiveItem(items[this._active]);
    e.preventDefault();
  }

  setActiveItem(el) {
    let items = Array.from(this.el.querySelectorAll('.menu-item'));
    items.forEach(el => el.removeAttribute('active'));
    this._active = null;

    if (el) {
      this._active = items.indexOf(el);
      el.setAttribute('active', '');
      el.scrollIntoViewIfNeeded();
    }
  }

  onLetterPress(e) {
    if (e.target.tagName == 'INPUT') {
      setTimeout(() => {
        let val = e.target.value; // interpret only 1 character as "empty"

        if (!val || val.length < 2) val = '';
        if (val === this.__lastFilterVal) return;
        this.__lastFilterVal = val;

        if (this.searchUrl) {
          // must stop typing for a moment before fetching results
          clearTimeout(this.__searchTermDelay);

          if (!val) {
            this.menu = this.__origMenu;
            this.render(); // update popover position

            if (this.presenter && this.presenter._updatePosition) this.presenter._updatePosition();
            return;
          }

          this.__searchTermDelay = setTimeout(() => {
            this.fetchResults(val);
          }, 700);
        } else {
          if (!val) this.__filteredMenu = null;else this.__filteredMenu = this.__fuse.search(val);
          this.render();
          this.setActiveItem();
        }
      }, 0);
      return;
    }

    let ts = new Date().getTime();
    if (!this._lastLetterPressTS || ts - this._lastLetterPressTS > this.opts.typeDelay) this._lastLetterPress = '';
    this._lastLetterPressTS = ts;
    this._lastLetterPress += e.key;
    let li = this.el.querySelector(`.menu-item[data-title^="${this._lastLetterPress}"]`);
    if (li) this.setActiveItem(li);
  }

  resolve(data) {
    // if( this.opts.onSelect )
    // 	this.opts.onSelect(data)
    if (this._resolve) this._resolve(data);
    if (this.presenter) this.presenter.close();
  }

  scrollToSelected() {
    setTimeout(() => {
      let el = this.el.querySelector('.selected');
      el && this.setActiveItem(el);
    }, 0);
  }
  /*
  	Presenters
  */


  popover(target, opts = {}) {
    this.render();
    let onClose = opts.onClose;

    opts.onClose = () => {
      onClose && onClose();
      if (this.opts.multiple) this.resolve(this.selected);else this.resolve(false);
    };

    opts.onKeydown = this.onKeydown.bind(this);
    this.presenter = new _popover.default(target, this.el, opts);
    this.scrollToSelected();
    if (this.searchIsOn) this.focusSearch();
    return this.promise;
  }

  modal(opts = {}) {
    return this.panel(opts);
  }

  panel(opts = {}) {
    this.render();
    opts.type = 'modal';
    opts.animation = 'scale';
    opts.onKeydown = this.onKeydown.bind(this);
    let onClose = opts.onClose;

    opts.onClose = () => {
      onClose && onClose();
      this.presenter = null;
      if (this.opts.multiple) this.resolve(this.selected);else this.resolve(false);
    };

    this.presenter = new _panel.default(this.el, opts).open();
    this.scrollToSelected();
    if (this.searchIsOn) this.focusSearch();
    return this.promise;
  }

}

exports.default = Menu;
},{"lit-html":"SP/d","lit-html/directives/unsafe-html":"/jTP","../popover":"Soyf","../panel":"cmZt","fuse.js":"Wp9p","../form-control/controls/check-box":"jNfL","./style.less":"r4vn"}],"7P61":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litHtml = require("lit-html");

class TabView {
  constructor(view) {
    // custom element - we lazy load these
    if (typeof view === 'string') {
      this._viewName = view;
      this._viewClass = customElements.get(view);

      if (this._viewClass && this._viewClass.title) {
        this.__title = this._viewClass.title;
        this.__id = this.__title;
      } else {
        this.__id = this._viewName;
      }

      if (this._viewClass.id) this.__id = this._viewClass.id; // HTML element
    } else {
      view.hidden = true;
      this.__view = view;
      this.__title = view.title;

      if (view.hasAttribute('view-id')) {
        this.__id = view.getAttribute('view-id');
      } else {
        this.__id = this.__title;

        this.__view.setAttribute('view-id', this.id);
      }

      this.__view.tabView = this;
      view.title = '';
    }
  }

  render(onClick) {
    return this.canDisplay ? _litHtml.html`
            <div class="tab-bar-item" ?active=${this.active} .tabView=${this} @click=${onClick}>
                <slot name="menu:${this.id}">${this.title}</slot>
            </div>
        ` : '';
  }

  get active() {
    return this.__active;
  }

  set active(isActive) {
    this.__active = isActive;
    if (!this.__view) return; // view not created yet

    this.view.hidden = !isActive;
    if (isActive) this.view.didBecomeActive && this.view.didBecomeActive();else this.view.didBecomeInactive && this.view.didBecomeInactive();
  }

  get view() {
    // lazy loading the html element view
    if (!this.__view) {
      if (this._viewClass) {
        this.__view = new this._viewClass();
        this.__view.tabView = this;
      } else {
        this.__view = document.createElement('section');
        this.__view.innerHTML = `<b-paper color="red" border dense><b>${this._viewName}</b> is not a custom element</b-paper>`;
      }

      this.__view.setAttribute('view-id', this.id);
    }

    return this.__view;
  }

  get id() {
    return this.__id;
  }

  get title() {
    return this.__title || 'No Title';
  }

  get path() {
    if (!this.__view) return '';
    return this.view.path || this.id;
  }

  get canDisplay() {
    if (!this._viewClass || this._viewClass.canDisplay === undefined) return true;
    return this._viewClass.canDisplay;
  }

}

exports.default = TabView;
},{"lit-html":"SP/d"}],"jVU8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("./view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabViews extends Map {
  set active(view) {
    if (view instanceof HTMLElement) view = view.tabBar.id;
    if (view instanceof _view.default) view = view.id;
    view = this.get(view) || this.first; // view is already the active one
    // if( view && view == this.active )
    //     return 

    if (view && !view.canDisplay) return false;
    this.forEach(v => v.active = false);

    if (view) {
      this.__active = view.id;
      view.active = true;
    }

    if (this.key) view ? localStorage.setItem('tab-bar:' + this.key + ':active', view.id) : localStorage.removeItem('tab-bar:' + this.key + ':active');
  }

  get active() {
    let active = this.key ? localStorage.getItem('tab-bar:' + this.key + ':active') : this.__active;
    return active && this.get(active);
  }

  get first() {
    return this.at(0);
  }

  at(i) {
    return Array.from(this.values())[i];
  }

  get last() {
    return this.at(this.size - 1);
  }

  map(fn) {
    let resp = [];
    this.forEach((v, key) => resp.push(fn(v, key)));
    return resp;
  }

}

exports.default = TabViews;
},{"./view":"7P61"}],"u9vI":[function(require,module,exports) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],"j3D9":[function(require,module,exports) {
var global = arguments[3];
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

},{}],"MIhM":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":"j3D9"}],"0pJf":[function(require,module,exports) {
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":"MIhM"}],"wppe":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":"MIhM"}],"uiOY":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":"wppe"}],"lPmd":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],"e5TX":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":"wppe","./_getRawTag":"uiOY","./_objectToString":"lPmd"}],"OuyB":[function(require,module,exports) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"bgO7":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":"e5TX","./isObjectLike":"OuyB"}],"iS0Z":[function(require,module,exports) {
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":"u9vI","./isSymbol":"bgO7"}],"CXfR":[function(require,module,exports) {
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":"u9vI","./now":"0pJf","./toNumber":"iS0Z"}],"BsQP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _menu = _interopRequireDefault(require("../menu"));

var _views2 = _interopRequireDefault(require("./views"));

var _view = _interopRequireDefault(require("./view"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('b-tabs', class extends _litElement.LitElement {
  static get properties() {
    return {
      key: {
        type: String,
        reflect: true
      },
      layout: {
        type: 'String',
        reflect: true
      },
      singlemenu: {
        type: Boolean,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.singlemenu = false;
    this.key = '';
    this.layout = 'top';
    this._resizeHandler = (0, _debounce.default)(() => {
      this.singlemenu = this.shouldBeSingleMenu;
    }, 250);
  }

  connectedCallback() {
    super.connectedCallback(); // window.addEventListener('resize', this._resizeHandler)

    if (!this.views) {
      let views = [];
      this.childNodes.forEach(node => {
        if (node.nodeName == '#text') {
          let str = node.textContent.trim();
          if (!str) return;

          let _views = str.split("\n").map(s => s.trim());

          views.push(..._views);
          node.textContent = '';
        } else if (node.slot) {// ignore views that have a slot name
        } else if (node.title) {
          views.push(node);
        } else {
          node.hidden = true;
          console.error('Cannot use `' + node.tagName + '` as it is missing a `title`');
        }
      });
      this.views = views;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback(); // window.removeEventListener('resize', this._resizeHandler)
  } // this breaks down when last item is hidden


  get shouldBeSingleMenu() {
    if (this.offsetWidth == 0) return false;
    let menuItems = this.shadowRoot.querySelectorAll('.tab-bar-item');
    let last = menuItems[menuItems.length - 1];
    if (!last) return false;
    return last.offsetLeft + last.offsetWidth >= this.offsetWidth || last.offsetTop + last.offsetHeight >= this.offsetHeight;
  }

  get views() {
    return this.__views;
  }

  set views(views) {
    this.__views = this.__views || new _views2.default();
    this.__views.key = this.key;
    views.forEach(v => {
      v = new _view.default(v);

      this.__views.set(v.id, v);
    });
    this.active = this.views.active || this.views.first;
  }

  static get styles() {
    return _litElement.css`
        :host {
            position: relative;
            display: grid;
            flex: 1;
            min-height: 0;

            --menuFontSize: 1em;
            --contentPadding: 2em;
            --menuItemPadding: .75em 1em;
            --menuItemRadius: 4px;
            --inactiveColor: rgba(0,0,0,.4);
            --activeColor: inherit;
            --contentBgd: none;
            --contentShadow: none;
        }

        .tab-bar {
            display: flex;
            font-size: var(--menuFontSize);
            min-width: 0;
            overflow: hidden;
        }

        .tab-bar-item {
            padding: var(--menuItemPadding);
            cursor: pointer;
            box-sizing: border-box;
            color: var(--inactiveColor);
        }

        .tab-bar-item[active] {
            color: var(--activeColor)
        }

        :host(:not([singlemenu])) .single-menu {display: none;}
        :host([singlemenu]) .tab-bar-item:not(.single-menu) {display: none;}

        :host([layout="top"]) { grid-template-rows: auto 1fr; }
        :host([layout="bottom"]) { grid-template-rows: 1fr auto; }
        :host([layout="left"]) { grid-template-columns: auto 1fr; }
        :host([layout="right"]) { grid-template-columns: 1fr auto; }

        :host([layout="left"]) .tab-bar,
        :host([layout="right"]) .tab-bar {
            flex-direction: column;
        }

        :host([layout="bottom"]) .tab-bar,
        :host([layout="right"]) .tab-bar {
            order: 2;
        }

        :host([layout="top"]) .tab-bar { border-bottom: solid 1px rgba(0,0,0,.1); }
        :host([layout="bottom"]) .tab-bar { border-top: solid 1px rgba(0,0,0,.1); }
        :host([layout="left"]) .tab-bar { border-right: solid 1px rgba(0,0,0,.1); }
        :host([layout="right"]) .tab-bar { border-left: solid 1px rgba(0,0,0,.1); }

        :host([layout="top"]) .tab-bar-item { border-bottom: solid 2px transparent; }
        :host([layout="bottom"]) .tab-bar-item { border-top: solid 2px transparent; }
        :host([layout="left"]) .tab-bar-item { border-right: solid 2px transparent; }
        :host([layout="right"]) .tab-bar-item { border-left: solid 2px transparent; }

        :host([layout="top"]) .tab-bar-item:hover { border-bottom-color: currentColor; }
        :host([layout="bottom"]) .tab-bar-item:hover { border-top-color: currentColor; }
        :host([layout="left"]) .tab-bar-item:hover { border-right-color: currentColor; }
        :host([layout="right"]) .tab-bar-item:hover { border-left-color: currentColor; }

        :host([layout="top"]) .tab-bar-item[active] { border-bottom-color: currentColor; }
        :host([layout="bottom"]) .tab-bar-item[active] { border-top-color: currentColor; }
        :host([layout="left"]) .tab-bar-item[active] { border-right-color: currentColor; }
        :host([layout="right"]) .tab-bar-item[active] { border-left-color: currentColor; }

        @media (max-width: 550px) {

            :host([layout="left"]),
            :host([layout="right"]) {
                grid-template-columns: none;
                grid-template-rows: auto 1fr;
            }

            :host([layout="left"]) .tab-bar,
            :host([layout="right"]) .tab-bar {
                flex-direction: row;
                overflow: auto;
                border-bottom: solid 1px rgba(0,0,0,.1);
            }

            :host([layout="left"]) .tab-bar-item { border-right: none; }
            :host([layout="right"]) .tab-bar-item { border-left: none; }

            :host([layout="left"]) .tab-bar-item, 
            :host([layout="right"]) .tab-bar-item {
                border-bottom: solid 2px transparent;
                flex-shrink: 0;
            }

            :host([layout="left"]) .tab-bar-item:hover, 
            :host([layout="right"]) .tab-bar-item:hover { border-bottom-color: currentColor; }

            :host([layout="left"]) .tab-bar-item[active], 
            :host([layout="right"]) .tab-bar-item[active] { border-bottom-color: currentColor; }
        }

        /*
            Slotted Content
        */
        slot.content {
            display: flex;
            background: var(--contentBgd);
            box-shadow: var(--contentShadow);
            overflow: auto;
        }

        .content::slotted(*) {
            flex: 1;
            align-self: flex-start;
            max-height: 100%;
        }
        
        /* dont add padding to custom elements */
        .content::slotted(.padded),
        .content::slotted(div),
        .content::slotted(section) {
            padding: var(--contentPadding);
        }

        .content::slotted([hidden]) {
            display: none;
        }
        
        /*
        THEME: root-tabs
        */
        :host(.root-tabs) {
            --activeColor: inherit;
            --contentBgd: #fff;
            --contentShadow: rgba(0,0,0,.2) 0 0 3px;
            --menuFontSize: 1.1em;
            --menuItemPadding: .65em 1em;
        }

        :host(.root-tabs) slot.content {
            border-radius: 4px 0 0 0;
        }

        :host(.root-tabs) .tab-bar {
            border: none !important;
            padding-left: .35em;
            padding-top: .25em;
            z-index: 1;
        }

        :host(.root-tabs[layout="top"]) .tab-bar { padding: .5em 0 0 .5em; }
        :host(.root-tabs[layout="bottom"]) .tab-bar { padding: 0 0 .5em .5em; }
        :host(.root-tabs[layout="left"]) .tab-bar { padding: .5em 0 0 .5em; }
        :host(.root-tabs[layout="right"]) .tab-bar { padding: .5em .5em 0 0; }

        :host(.root-tabs) .tab-bar-item {
            border: solid 1px transparent;
        }

        :host(.root-tabs[layout="top"]) .tab-bar-item {
            border-bottom: none !important;
            border-radius: var(--menuItemRadius) var(--menuItemRadius) 0 0;
        }

        :host(.root-tabs[layout="bottom"]) .tab-bar-item {
            border-top: none !important;
            border-radius: 0 0 var(--menuItemRadius) var(--menuItemRadius);
        }

        :host(.root-tabs[layout="left"]) .tab-bar-item {
            border-right: none !important;
            border-radius: var(--menuItemRadius) 0 0 var(--menuItemRadius);
        }

        :host(.root-tabs[layout="right"]) .tab-bar-item {
            border-left: none !important;
            border-radius: 0 var(--menuItemRadius) var(--menuItemRadius) 0;
        }

        :host(.root-tabs) .tab-bar-item:hover:not([active]) {
            border-color: rgba(0,0,0,.1);
            color: rgba(0,0,0,.5);
        }

        :host(.root-tabs) .tab-bar-item[active] {
            background: var(--contentBgd);
            /* border: solid 1px rgba(0,0,0,.1); */
            box-shadow: rgba(0,0,0,.2) 0 0 3px;
        }
    `;
  }

  render() {
    return _litElement.html`
        <header class="tab-bar">
            <slot name="menu:before"></slot>
            <div class="tab-bar-item single-menu" active @click=${this.popoverMenu}>
                <b-icon name="menu"></b-icon>
                ${this.views.active.title}
            </div>
            ${this.views.map(v => v.render(this.menuClick))}
            <slot name="menu:after"></slot>
        </header>
        <slot class="content"></slot>
    `;
  }

  async popoverMenu(e) {
    let selected = await new _menu.default(this.views.map(v => {
      return {
        label: v.title,
        val: v
      };
    })).popover(e.target);
    if (selected) this.active = selected.val;
  }

  menuClick(e) {
    let oldVal = this.active;
    this.active = e.currentTarget.tabView;
    if (this.active != oldVal) this.dispatchEvent(new CustomEvent('active-changed', {
      detail: {
        tabView: this.views.active
      },
      bubbles: false,
      composed: true
    }));
  }

  onModelChange() {
    if (this.views) this.views.active.view.model = this.model;
  }

  get active() {
    return this.views && this.views.active && this.views.active.id;
  }

  set active(val) {
    this.views.active = val;
    this.update();
    let view = this.views.active.view;
    this.setAttribute('active', this.views.active.id);
    view.model = this.model;
    if (view.parentElement != this) this.appendChild(view);
  }

});

var _default = customElements.get('b-tabs');

exports.default = _default;
},{"lit-element":"+bhx","../menu":"0tCY","./views":"jVU8","./view":"7P61","lodash/debounce":"CXfR"}],"ZQnj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// const store = require('util/store')
class FormHandler extends HTMLElement {
  constructor() {
    super(); // bind context to functions

    this.onModelSync = this.onModelSync.bind(this);
    this.onModelChange = this.onModelChange.bind(this);
    this.onModelEdited = this.onModelEdited.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  get noGridArea() {
    return this.hasAttribute('no-grid-area');
  }

  get autoSave() {
    return this.hasAttribute('autosave');
  }

  set autoSave(val) {
    val ? this.setAttribute('autosave', '') : this.removeAttribute('autosave');
  }

  get patchSave() {
    return this.hasAttribute('patchsave');
  }

  set patchSave(val) {
    val ? this.setAttribute('patchsave', '') : this.removeAttribute('patchsave');
  }

  connectedCallback() {
    let host = this.getRootNode().host;
    if (host && !host.formHandler) host.formHandler = this; // TODO: change to `controls`?

    this.editors = Array.from(this.querySelectorAll('form-control[key], check-box[key], radio-group[key], text-field[key], select-field[key]'));
    this.editorsByKey = {};
    this.editors.forEach(el => {
      let key = el.getAttribute('key');

      if (key) {
        this.editorsByKey[key] = el;
        if (!this.noGridArea) el.style.gridArea = key;
      }
    });
    if (this.disabled || this.hasAttribute('disabled')) this.disabled = true;
    this.addEventListener('change', this.onEditorChange, true);

    this._updateEditors();
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'disabled') this.disabled = newValue !== null;
  }

  disconnectedCallback() {
    this.editors = [];
    this.editorsByKey = {};
    this.model = null;
    this.removeEventListener('change', this.onEditorChange);
  }

  get model() {
    return this._model;
  }

  set model(model) {
    if (!model) {
      if (this.model) {
        this.model.off('sync', null, this);
        this.model.off('change', null, this);
        this.model.off('edited', null, this);
        delete this._model;
      }

      return;
    }

    if (model == this.model) return;
    this._model = model;
    this.model._editedAttrs = this.model._editedAttrs || {};
    this.model.on('sync', this.onModelSync, this);
    this.model.on('change', this.onModelChange, this);
    this.model.on('edited', this.onModelEdited, this);

    this._updateEditors();
  }

  store(vals) {
    let key = this.getAttribute('store');
    if (!key) return undefined;
    let data = store(key) || {};
    if (vals === undefined) return data;
    data = Object.assign(data, vals);
    store(key, data);
  }

  storedValue(key, defaultVal = null) {
    if (this.model) return this.model.has(key) ? this.model.get(key) : defaultVal;
    let data = this.store();
    return data ? data[key] : defaultVal;
  }

  _updateEditors() {
    if (this.editors && (this.model || this.hasAttribute('store'))) this.editors.forEach(el => {
      // set the value of each editor based on the value in the model
      let key = el.getAttribute('key');
      let val = this.storedValue(key);
      if (val && val._isAMomentObject) val = val.format(el.control._datePicker ? el.control._datePicker.format : 'MM/DD/YYYY');
      if (val !== undefined) el.value = val;
    });
  }

  onModelSync(m, attrs, opts) {
    let trigger = false; // see if we need to clear any "edited" attributes

    for (let key in attrs) {
      if (m._editedAttrs && m._editedAttrs[key] !== undefined) {
        trigger = true;
        delete m._editedAttrs[key];
      }
    } // if we cleared any edited attributes, trigger the change


    if (trigger) this.model.trigger('edited', this.model.isEdited(), this.model.editedAttrs());
  }

  onModelEdited(isEdited, editedAttrs) {
    this.editors.forEach(el => {
      if (editedAttrs[el.key] != undefined && !this.autoSave) el.setAttribute('unsaved', '');else el.removeAttribute('unsaved');
    });
  }

  onModelChange(m, opts = {}) {
    for (let key in m.changed) {
      // if changed value is different than edited value, clear the edited value
      if (m._editedAttrs && m._editedAttrs[key] && m._editedAttrs[key] != m.changed[key]) {
        delete m._editedAttrs[key];
      } // set the editor with the new value


      if (this.editorsByKey[key]) {
        this.editorsByKey[key].value = m.changed[key];
        this.editorsByKey[key].removeAttribute('unsaved'); // this causes problems with tracking "editedAttr"
        // if( m._origAttrs )
        // 	m._origAttrs[key] = m.changed[key]
      }
    }
  }

  onEditorChange(e) {
    if (!e.detail) return;
    let m = this.model;
    let el = e.target;
    let key = el.getAttribute('key');
    let val = e.detail.value;
    if (!key) return;
    let changes = {};
    changes[key] = val; // optionally make other changes based on this change
    // TODO: think of a way to implement this again for the custom element?
    // if( this.opts.onEditorChange && this.opts.onEditorChange(m, changes, key, val) === false )
    // 	return
    // ugh, this is hacky and should be solved a better way

    if (el.control && el.control.type == 'date' && val) {
      changes[key] = el.control._datePicker.formatted('YYYY-MM-DD');
    }

    this.store(changes);

    if (this.model) {
      if (this.autoSave === true) {
        this.model.save(changes, {
          patch: this.patchSave || false
        });
        this.model.trigger('edited', false, changes);
      } else {
        this.model.editAttr(changes);
      }
    }
  }

  get disabled() {
    return this.__disabled || false;
  }

  set disabled(disabled = false) {
    this.__disabled = disabled === true;
    this.editors && this.editors.forEach(el => el.disabled = this.__disabled);
  }

  get isInvalid() {
    return !!this.editors.find(el => el.isInvalid);
  }

  focus(index = 0) {
    this.editors[index] && this.editors[index].focus();
  }

  get(key) {
    if (typeof key == 'number') return this.editors[key];
    return Array.from(this.editors).find(ed => ed.key == key);
  }

}

customElements.define('form-handler', FormHandler);

var _default = customElements.get('form-handler');

exports.default = _default;
},{}],"Sclr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _default = _litElement.css`
slot#value {
	display: none;
}

slot[name="before"] { grid-area: before }
slot[name="help"] { grid-area: help }
slot[name="after"] { grid-area: after }

slot[name="before"],
slot[name="help"],
slot[name="after"]{
	display: block;
}

:host {
	align-self: flex-start;
	/* contain: content; */
	position: relative;
	display: inline-block;
	vertical-align: top;
	--placeholderColor: rgba(0,0,0,.3);
	--selectionBgd: #FFECB3;
	--focusBgd: #FFF8E1;
	--focusColor: #2196F3;
	--bgd: #fff;
	--borderColor: rgba(0,0,0,.3);
	--invalidColor: #ff1744;
	--unsavedColor: transparent; /*#FFC107;*/
	--disabledColor: rgba(0,0,0,.3);
	--labelFontSize: inherit;
}

:host main {
	grid-area: main;
	width: 100%;
	position: relative;
	display: flex;
	line-height: 1em;
	caret-color: #E91E63;
	box-sizing: border-box;
}

/* :host(:not([disabled]):hover) main, */
/* :host(:not([disabled]):focus-within) main */
/* :host(:not([disabled])[focused]) main { */
	/* background: var(--focusBgd);
} */

:host([disabled]) main {
	color: var(--disabledColor);
}

:host(:not([disabled])) main ::selection {
	background: var(--selectionBgd);
}

/* :host(:not([disabled])) main {
	cursor: text;
} */

.label {
	position: absolute;
	z-index: 0;
	box-sizing: border-box;
	width: 100%;
	white-space: nowrap;
	font-size: var(--labelFontSize);
}

.prefix {
	order: 10;
}

.suffix {
	order: 30;
}

.prefix, .suffix {
	position: relative;
	z-index: 10;
	flex-shrink: 0;
    color: var(--placeholderColor);
	display: flex;
	align-items: center;
}

slot[name="prefix"]::slotted(form-control),
slot[name="suffix"]::slotted(form-control) {
	color: #333;
}

/* .control {
	order: 20;
	flex-grow: 1;
	outline: none;
	min-width: .25em;
	position: relative;
	z-index: 10;
} */

slot[name="control"]::slotted(*) {
	/* background: red; */
	order: 20;
	flex-grow: 1;
	outline: none;
	min-width: .25em;
	position: relative;
	z-index: 10;
}

/* .control[empty]:before {
	content: attr(data-placeholder);
	color: var(--placeholderColor);
} */

:host(:not([material])[invalid]) main {
	color: var(--invalidColor)
}

.btns {
	display: none;
}

:host([btns]) .btns {
	order: 40;
	display: grid;
	/* height: 100%; */
	top: 0;
	flex-direction: column;
	min-width: 0;
	flex-grow: 0;
	font-size: 50%;
	position: relative;
	cursor: pointer;
}

.btns > span {
	padding: 0 .25em;
	display: flex;
	justify-content: center;
	align-items: center;
}

.btns > span svg {
	height: 2em;
	width: 2em;
}

.btn-save:hover {
	color: green;
	/* background: blue; */
}

.btn-cancel:hover {
	color: red;
	/* background: orange; */
}

:host([hidden]),
[hidden] {
	display: none !important;
}

slot[name="help"] {
	margin: .5em 0 0;
	font-size: .8em;
	color: rgba(0,0,0,.6);
	display: block;
}



/*
	Material
*/

:host([material]) {
	--focusBgd: transparent;
	padding-top: .25em;
	--padY: .6em;
	--borderColor: currentColor;
}

:host([material]) main {
	border-bottom: solid 1px var(--borderColor);
	padding-top: var(--padY);
}

:host([material]:not(:focus-within):not([focused]):hover) main {
	background: var(--bgd);
}

:host([material]) main:before {
	content: '';
	border: solid 2px transparent;
	position: absolute;
	width: calc(100% + 2px);
	height: calc(100% + 2px);
	box-sizing: border-box;
	top: -1px;
	left: -1px;
}

:host([material]) slot[name="control"]::slotted(*) {
	padding: var(--padY) 0;
	/* border-bottom: solid 1px transparent; */
}

:host([material]) slot[name="control"]::slotted(radio-group) {
	--padY: .25em;
	--padX: .25em;
}

:host slot[name="control"]::slotted(check-box) {
	 border-bottom: solid 2px transparent
}

/* :host([unsaved]:not([material])) slot[name="control"]::slotted(check-box) {
	border-bottom-color: var(--unsavedColor);
} */

:host([material]) .label {
	color: var(--placeholderColor);
	display: block;
	transition: 120ms;
	position: absolute;
	padding: var(--padY) 0;
}

:host([material]) .prefix,
:host([material]) .suffix {
	padding: var(--padY) 0;
}

:host([material]:not([empty])),
:host([material]:focus-within),
:host([material][focused]) {
	--labelFontSize: .7em;
}

/* :host([material]) .control:not([empty]) ~ .label, */
:host([material]:not([empty])) .label,
:host([material]:focus-within) .label,
:host([material][focused]) .label {
	color: inherit;
	transform: translateY(calc(-50% - (var(--padY) / 2)));
	z-index: 11;
}

:host([material]) .prefix,
:host([material]) .suffix {
	opacity: 0;
	transition: 120ms;
}

/* :host([material]) .control:not([empty]) ~ .prefix,
:host([material]) .control:not([empty]) ~ .suffix, */
:host([material]:not([empty])) .prefix,
:host([material]:not([empty])) .suffix,
:host([material]:focus-within) .prefix,
:host([material]:focus-within) .suffix,
:host([material][focused]) .prefix,
:host([material][focused]) .suffix {
	opacity: 1;
}

:host([material]:focus-within) main:before,
:host([material][focused]) main:before {
	border-bottom-color: var(--focusColor);
}

:host([material][invalid]) main:before {
	border-bottom-color: var(--invalidColor);
}

/* :host([material][unsaved]) main:before {
	border-bottom-color: var(--unsavedColor);
} */

:host([material]:focus-within) .label,
:host([material][focused]) .label {
	color: var(--focusColor);
}

:host([material][invalid]) .label {
	color: var(--invalidColor);
}


/*
	Material Outline
*/
:host([material="outline"]) {
	margin: 0 .5em .5em 0;
}

:host([material="outline"]) main:before {
	border-radius: 4px;
}
	
:host([material="outline"]) main {
	border: solid 1px var(--borderColor);
	padding-top: 0;
	border-radius: 4px;
	background: var(--bgd);
}

/* :host([material="outline"]) .control, */
:host([material="outline"]) slot[name="control"]::slotted(*),
:host([material="outline"]) .label {
	padding: .75em;
	border-radius: 3px;
}

:host([material="outline"]) slot[name="control"]::slotted(radio-group) {
	--padY: .25em;
	--padX: .5em;
}

:host([material="outline"]) .label {
	width: auto;
}

:host([material="outline"]) .prefix {
	padding: .75em;
    padding-right: 0;
    margin-right: -.75em;
}

:host([material="outline"]) .suffix {
	padding: .75em;
    padding-left: 0;
    margin-left: -.75em;
}

:host([material="outline"]) .control:not([empty]) ~ .label,
:host([material="outline"]:not([empty])) .label,
:host([material="outline"]:focus-within) .label,
:host([material="outline"][focused]) .label {
	background: var(--bgd);
	padding: 0 .35em;
	margin-left: .75em;
	transform: translateY(-50%);
}

:host([material="outline"]:focus-within) main:before,
:host([material="outline"][focused]) main:before {
	border-color: var(--focusColor);
}	

:host([material="outline"][invalid]) main:before {
	border-color: var(--invalidColor);
}

/* :host([material="outline"][unsaved]) main:before {
	border-color: var(--unsavedColor);
} */

:host([material="outline"]) slot[name="help"] {
	margin: .5em .75em 0
}

/*
	Filled
*/		
:host([material="filled"]) {
	--bgd: #eee;
	--focusBgd: var(--bgd);
	--padY: .75em;
	--padX: .75em;
	--placeholderColor: rgba(0,0,0,.3);
	margin: 0 .5em .5em 0;
}

:host([material="filled"]) main {
	border: solid 1px var(--bgd);
	padding-top: 1em;
	border-radius: 4px;
	background: var(--bgd);
}

:host([material="filled"].nolabel) main, /* deprecated, use attribute */
:host([material="filled"][nolabel]) main {
	padding-top: 0;
}

:host([material="filled"].dense) main, /* deprecated, use attribute */
:host([material="filled"][dense]) main {
	--padY: .5em;
}

:host([material="filled"]) main:before {
	border-radius: 4px;
}

:host([material="filled"]) .control,
:host([material="filled"]) slot[name="control"]::slotted(*),
:host([material="filled"]) .label {
	padding: var(--padY) var(--padX);
	border-radius: 3px;
}

:host([material="filled"]) .label {
	transform: translateY(-20%);
	width: auto;
}

:host([material="filled"]) .prefix {
	padding: var(--padY) var(--padX);
    padding-right: 0;
    margin-right: calc(-1 * var(--padX));
}

:host([material="filled"]) .suffix {
	padding: var(--padY) var(--padX);
    padding-left: 0;
    margin-left: calc(-1 * var(--padX));
}

:host([material="filled"]:not([empty])) .label,
:host([material="filled"]:focus-within) .label,
:host([material="filled"][focused]) .label {
	background: var(--bgd);
	padding: 0 .35em;
	margin-left: var(--padX);
	transform: translateY(-50%);
}

:host([material="filled"]:focus-within) main:before,
:host([material="filled"][focused]) main:before {
	border-color: var(--focusColor);
}	

:host([material="filled"][invalid]) main:before {
	border-color: var(--invalidColor);
}

/* :host([material="filled"][unsaved]) main:before {
	border-color: var(--unsavedColor);
} */

:host([material="filled"]) slot[name="help"] {
	margin: var(--padY) var(--padX) 0;
}
`;

exports.default = _default;
},{"lit-element":"+bhx"}],"swB1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formControlCss = _interopRequireDefault(require("./form-control.css.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
	Form Control
*/
class FormControlElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    let label = this.getAttribute('label') || '<slot name="label"></slot>';
    let prefix = this.getAttribute('prefix') || '<slot name="prefix"></slot>';
    let suffix = this.getAttribute('suffix') || '<slot name="suffix"></slot>'; // if prefix/suffix have spaces at the beginning or end of string assume the
    // developer wanted the sapce to show and replace with non-breaking space so it does

    prefix = prefix.replace(/^\s+/, '&nbsp;');
    prefix = prefix.replace(/\s+$/, '&nbsp;');
    suffix = suffix.replace(/^\s+/, '&nbsp;');
    suffix = suffix.replace(/\s+$/, '&nbsp;');
    temp.innerHTML = `
			<style>${_formControlCss.default.cssText}</style>
			<slot name="before"></slot>
			<main>
				<slot name="control"></slot>
				<div class="prefix">${prefix}</div>
				<div class="label">${label}</div>
				<div class="suffix">${suffix}</div>
				<div class="btns">
					<span class="btn-save">
						<svg class="check" focusable="false" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
					</span>
					<span class="btn-cancel">
						<svg class="j2dfb39" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg>
					</span>
				</div>
			</main>
			<slot name="help"></slot>
			<slot name="after"></slot>
			<slot id="value"></slot>`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    let value = this.$('#value');
    this._val = value.assignedNodes().map(el => el.textContent.trim()).join(' ');
    this._val = this._val.replace(/^\n|\n$/g, '').trim();
    this.control = this.querySelector('.control, text-field, rich-text-field, select-field, check-box, radio-group');

    if (this.control) {
      this.control.slot = 'control';
      this.mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
          // mirror these attributes from the control onto the form-control
          if (['invalid', 'empty', 'no-value', 'falsy', 'focused'].includes(m.attributeName)) {
            if (this.control.hasAttribute(m.attributeName)) this.setAttribute(m.attributeName, true);else this.removeAttribute(m.attributeName);
          }
        });
      });
      this.mutationObserver.observe(this.control, {
        attributes: true,
        childList: false,
        subtree: false
      });
    }

    this.addEventListener('click', this._onClick.bind(this), true);
    this.addEventListener('change', this._onChange);
  }

  _onChange(e) {
    if (e.target == this) return;
    if (e.target.tagName == 'FORM-CONTROL') return;
    e.stopPropagation();
    var event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        key: this.key
      }
    });
    this.dispatchEvent(event);
  }

  $(str) {
    return this.shadowRoot.querySelector(str);
  }

  $$(str) {
    return this.shadowRoot.querySelectorAll(str);
  }

  connectedCallback() {
    this._setClassNames(); // hide slots that are empty


    this.$$('slot').forEach(slot => {
      if (slot.assignedNodes().length == 0) slot.setAttribute('hidden', '');else slot.removeAttribute('hidden');
    }); // defer - then make sure the form-control remains as wide as the label

    setTimeout(() => {
      if (this.style.minWidth == '') this.style.minWidth = this.$('.label').offsetWidth;
      if (this.control) this.control.disabled = this.disabled;
    }, 0);
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.control && this.control.disabled !== undefined) this.control.disabled = this.disabled;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val = true) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get key() {
    return this.getAttribute('key');
  }

  get value() {
    return this.control && this.control.value;
  }

  set value(val) {
    if (this.control) this.control.value = val;
  }

  get dbValue() {
    let control = this.control;
    if (!control) return undefined;
    let val = control.dbValue;
    return val !== undefined ? val : control.value;
  }

  get options() {
    return this.control && this.control.options;
  }

  set options(val) {
    if (this.control) this.control.options = val;
  }

  get isInvalid() {
    return this.control && this.control.isInvalid;
  }

  get label() {
    return this.$('.label').innerText;
  }

  set label(str) {
    this.$('.label').innerHTML = str;

    if (str) {
      this.classList.remove('nolabel');
    } else {
      this.classList.add('nolabel');
    }
  }

  _setClassNames() {
    let labelNodes = this.$('.label').childNodes;
    if (labelNodes.length == 0 || labelNodes[0].tagName == 'SLOT' && labelNodes[0].assignedNodes().length == 0) this.classList.add('nolabel');
  }

  _onClick(e) {
    // console.log(e.target);
    if (e.target == this) this.focus(); // if( !e.target.isFocused && !e.target.slot)
    // 	this.focus()
  }

  focus() {
    this.control && this.control.focus();
  }

}

customElements.define('form-control', FormControlElement);

var _default = customElements.get('form-control');

exports.default = _default;
},{"./form-control.css.js":"Sclr"}],"TZ6L":[function(require,module,exports) {
const btnPresets = {
  'dismiss': {
    label: 'Dismiss'
  },
  'cancel': {
    label: 'Cancel'
  },
  'no': {
    label: 'No'
  },
  'done': {
    label: 'Done'
  },
  'ok': {
    label: 'Okay',
    color: 'blue'
  },
  'save': {
    label: 'Save',
    color: 'green'
  },
  'delete': {
    label: 'Delete',
    color: 'red'
  }
};

module.exports = function makeBtn(opts = {}, i) {
  if (typeof opts == 'string') {
    if (!btnPresets[opts]) return console.warn('Button preset `' + opts + '` does not exist');
    opts = btnPresets[opts];
  }

  let {
    label = '',
    className = '',
    //'text-btn fw-bold',
    color = '',
    icon = '',
    text = true
  } = opts; // icon = icon ? 'icon-'+icon : ''

  return `<b-btn ${text && 'text'} icon="${icon}" color="${color}" class="${className}">${label}</b-btn>`; // return `<span class="btn ${className} ${color} ${icon}">${label}</span>`
};
},{}],"HbKK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litHtml = require("lit-html");

const Panel = require('../panel').default;

const Popover = require('../popover').default;

const makeBtn = require('./make-btn'); // FIXME: this module needs to be refactored using lit-element to better apply styles


const styles = require('./style.less');

const cancelBtns = ['dismiss', 'cancel', 'no'];

class Dialog {
  constructor(opts = {}) {
    this.opts = opts = Object.assign({
      icon: '',
      title: '',
      msg: '',
      view: null,
      w: null,
      btns: ['dismiss'],
      className: ''
    }, opts);
    this.el = document.createElement('div');
    opts.className += ' nopadding dialog';
    if (this.opts.icon) opts.className += ' sideicon';
    opts.className.split(' ').forEach(className => className && this.el.classList.add(className));
    let [iconName, iconClass] = (opts.icon || '').split(' '); // FIXME: animation needs added

    let icon = opts.icon ? `<b-icon name="${iconName}" class="${iconClass || ''} animated speed-2 flipInY"></b-icon>` : '';
    let btns = opts.btns ? opts.btns.map(btn => makeBtn(btn)).join("\n") : '';
    if (opts.icon === 'spinner') icon = `<b-spinner></b-spinner>`;
    this.el.innerHTML = `<style>${styles}</style>
							<div class="d-icon">${icon}</div>
							<h2 class="d-title">${opts.title}</h2>
							<div class="d-msg">${opts.msg}</div>
							<div class="d-btns">${btns}</div>`;

    if (opts.msg instanceof _litHtml.TemplateResult) {
      (0, _litHtml.render)(opts.msg, this.el.querySelector('.d-msg'));
    }

    if (this.opts.w) this.el.style.width = typeof this.opts.w == 'number' ? this.opts.w + 'px' : this.opts.w;

    if (this.opts.view) {
      if (!this.opts.icon && !this.opts.title && !this.opts.msg) {
        if (this.opts.view instanceof HTMLElement) {
          this.el.innerHTML = `<div class="d-btns">${btns}</div>`;
          this.el.prepend(this.opts.view);
        } else {
          this.el.innerHTML = `${this.opts.view}<div class="d-btns">${btns}</div>`;
        }
      } else this.el.querySelector('.d-msg').appendChild(this.opts.view);
    }

    this.el.addEventListener('click', this.onClick.bind(this), true);
    this.promise = new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  set title(str) {
    this.opts.title = str;
    let el = this.el.querySelector('.d-title');
    if (el) el.innerHTML = str;
  }

  set msg(str) {
    this.opts.msg = str;
    let el = this.el.querySelector('.d-msg');
    if (el) el.innerHTML = str;
  }

  set btns(btns) {
    this.opts.btns = btns;
    btns = btns ? btns.map(btn => makeBtn(btn)).join("\n") : '';
    let el = this.el.querySelector('.d-btns');
    if (el) el.innerHTML = btns;
  }

  set icon(icon) {
    this.opts.icon = icon;
    let [iconName, iconClass] = (icon || '').split(' ');
    icon = this.opts.icon ? `<b-icon name="${iconName}" class="${iconClass || ''} animated speed-2 flipInY"></b-icon>` : '';
    if (this.opts.icon === 'spinner') icon = `<b-spinner></b-spinner>`;
    let el = this.el.querySelector('.d-icon');
    if (el) el.innerHTML = icon;
  }

  onClick(e) {
    let el = e.target;

    if (el.tagName == 'B-BTN') {
      let index = Array.from(el.parentElement.children).indexOf(el);
      let btnInfo = this.opts.btns[index];
      this.resolveBtn(btnInfo);
    }
  }

  onKeydown(e) {
    let btnInfo = undefined;

    if (e.code == 'Escape') {
      btnInfo = this.opts.btns.find(btn => cancelBtns.includes(btn));
    } else if (e.code == 'Enter') {
      btnInfo = this.opts.btns.find(btn => !cancelBtns.includes(btn));
    }

    if (btnInfo != undefined) {
      // let other views finish with keydown before we process (ex: Dialog.prompt)
      setTimeout(() => {
        if (document.activeElement == document.body) this.resolveBtn(btnInfo);
      }, 0);
    }
  }

  resolveBtn(btnInfo) {
    if (cancelBtns.includes(btnInfo)) btnInfo = false;
    if (this.resolve(btnInfo) === true) this.close();
  }

  resolve(resp) {
    if (this.opts.onResolve) {
      try {
        resp = this.opts.onResolve(resp, this);
      } catch (err) {
        console.log('failed to resolve');
        return false;
      }
    }

    if (this._resolve) this._resolve(resp);
    return true;
  }

  close() {
    if (this.presenter) this.presenter.close();
  }

  $(str) {
    return this.el.querySelector(str);
  }

  $$(str) {
    return this.el.querySelectorAll(str);
  }
  /*
  	Presenters
  */


  popover(target, opts = {}) {
    if (target.currentTarget) target = target.currentTarget;
    let onClose = opts.onClose;

    opts.onClose = () => {
      onClose && onClose();
      this.resolve(false);
    };

    opts.onKeydown = this.onKeydown.bind(this);
    this.presenter = new Popover(target, this.el, opts);
    return this.promise;
  }

  modal(opts = {}) {
    return this.panel(opts); // might need to reactivate Modal below
  }

  panel(opts = {}) {
    opts = Object.assign({
      type: 'modal',
      animation: 'scale',
      disableBackdropClick: true
    }, opts);
    opts.onKeydown = this.onKeydown.bind(this);
    let onClose = opts.onClose;

    opts.onClose = () => {
      onClose && onClose();
      this.resolve(false);
    };

    this.presenter = new Panel(this.el, opts).open();
    return this.promise;
  }

  notif(opts) {
    opts = Object.assign({
      autoClose: this.opts.btns ? false : 3000,
      clickRemoves: !this.opts.btns,
      onAutoClose: () => {
        this.resolve(false);
      }
    }, opts);
    this.presenter = app.msgs.add(this.el, opts);
    return this.promise;
  }

}

exports.default = Dialog;
},{"lit-html":"SP/d","../panel":"cmZt","../popover":"Soyf","./make-btn":"TZ6L","./style.less":"r4vn"}],"pos3":[function(require,module,exports) {
const Dialog = require('./dialog').default;

module.exports = Dialog;

Dialog.confirm = function (opts = {}) {
  return new Dialog(Object.assign({
    // icon: 'trash text-red',
    title: 'Continue?',
    msg: 'Are you sure?',
    btns: ['cancel', 'ok']
  }, opts));
};

Dialog.confirmDelete = function (opts = {}) {
  return new Dialog(Object.assign({
    icon: opts.title || opts.msg ? 'trash red' : '',
    btns: ['cancel', 'delete']
  }, opts));
};

Dialog.alert = function (opts = {}) {
  return new Dialog(Object.assign({
    btns: ['dismiss']
  }, opts));
};

Dialog.error = function (opts = {}) {
  return new Dialog(Object.assign({
    icon: 'alert red',
    btns: ['dismiss']
  }, opts));
};

Dialog.warn = function (opts = {}) {
  return new Dialog(Object.assign({
    icon: 'attention-1 orange',
    btns: ['dismiss']
  }, opts));
};

Dialog.success = function (opts = {}) {
  return new Dialog(Object.assign({
    icon: 'ok-circled green',
    title: 'Success',
    btns: ['dismiss']
  }, opts));
};

Dialog.prompt = function (opts = {}) {
  opts = Object.assign({
    val: '',
    msg: '',
    prefix: '',
    suffix: '',
    validate: '',
    html: false,
    required: false,
    label: '',
    placeholder: '',
    helpText: '',
    w: 300,
    multiline: false,
    multiple: false,
    btns: ['cancel', 'save']
  }, opts);
  if (opts.msg) opts.msg = `<div>${opts.msg}</div>`;

  opts.onResolve = function (resp, dialog) {
    let control = dialog.$('form-control');
    if (!resp) return resp;
    if (control.isInvalid) throw Error('Invalid data');
    resp = opts.html ? control.value : control.control.textValue || control.value;
    return resp;
  };

  let prefix = '';
  let suffix = '';

  if (opts.prefix.match(/^icon/)) {
    prefix = `<span slot="prefix" class="${opts.prefix}"></span>`;
    opts.prefix = '';
  }

  if (opts.suffix.match(/^icon/)) {
    suffix = `<span slot="suffix" class="${opts.suffix}"></span>`;
    opts.suffix = '';
  }

  let control = `<text-field
		validate="${opts.validate}"
		placeholder="${opts.placeholder}"
		${opts.html ? 'html' : ''}
		${opts.multiline ? 'multiline' : ''}
		${opts.required ? 'required' : ''}>${opts.val}</text-field>`;
  if (opts.options) control = `<select-field
					placeholder="${opts.placeholder}"
					${opts.multiple ? 'multiple' : ''}
					></select-field>`;
  opts.msg += `
			<form-control material="outline" label="${opts.label}" prefix="${opts.prefix}"suffix="${opts.suffix}">
				${control}
				<div slot="help">${opts.helpText}</div>
				${prefix}
				${suffix}
			</form-control>
			`;
  let dialog = new Dialog(opts);
  control = dialog.$('form-control');
  if (opts.options) control.options = opts.options;
  setTimeout(function () {
    control.focus();
  }, 500);
  return dialog;
};
},{"./dialog":"HbKK"}],"VxKk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _litElement = require("lit-element");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styles = _litElement.css`

:host {
    display: inline-block;
    --color: #2196f3;
    --radius: 4px;
    text-align: left;
    border-radius: var(--radius);
    background: #fff;
}

main > header {
    background: var(--color);
    color: #fff;
    padding: 1em 1em 1.25em 1em;
    border-radius: var(--radius) var(--radius) 0 0;
    display: grid;
    grid-template-columns: 1fr auto
}

main > header * {
    margin: 0;
    padding: 0;
    font-weight: normal;
    cursor: pointer;
    display: inline-block;
    justify-self: flex-start;
}

main > header .today {
    text-transform: uppercase;
    font-size: .7em;
    font-weight: bold;
    justify-self: flex-end;
    align-self: flex-start;
    opacity: .6;
}

main > header .today:hover {
    opacity: 1;
}

main > header h4 {
    margin: 0 0 .75em 0;
}

main:not(.pick-year) > header h4 {
    color: rgba(255,255,255,.5);
}

main.pick-year > header h1 {
    color: rgba(255,255,255,.5);
}

section {
    padding: 1em;
    position: relative;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
}

nav > svg {
    height: 1.4em;
    padding: .25em;
    margin: -.25em;
    opacity: .4;
    cursor: pointer;

}

nav > svg:hover {
    opacity: 1;
}

section header,
section .days {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    font-size: .8em;
    text-align: center;
}

section header {
    color: rgba(0,0,0,.3);
    margin: 1em 0;
    font-size: .7em;
}

day {
    padding: .7em;
    height: 1.4em;
    width: 1.4em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2em;
    cursor: pointer;
}

day[active] {
    background: var(--color);
    color: #fff;
}

day[today]:not([active]) {
    color: var(--color)
}


years,
months {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    overflow: auto;
    background: #fff;
    border-radius: 0 0 var(--radius) var(--radius);
}

main:not(.pick-year) years {
    display: none;
}

year {
    padding: .5em 0;
    cursor: pointer;
}

year[active],
month[active] {
    color: var(--color);
    font-size: 1.4em;
}

months {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

month {
    justify-self: stretch;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
}

main:not(.pick-month) months {
    display: none;
}

:host([calendar-only]) main > header {
    display: none;
}`;

const changeEvent = function (el, details = {}) {
  var event = new CustomEvent('change', {
    bubbles: true,
    composed: true,
    detail: Object.assign({}, details, {
      value: el.value
    })
  });
  el.dispatchEvent(event);
};

class DatePickerElement extends HTMLElement {
  constructor() {
    super();

    let htmlDaysHeader = _moment.default.weekdaysMin().map(str => `<div>${str}</div>`).join("\n");

    let startYear = parseInt(this.getAttribute('year-start') || '1900');
    let endYear = parseInt(this.getAttribute('year-end') || '2099');
    let years = '';

    while (startYear <= endYear) {
      years += `<year value="${startYear}">${startYear++}</year>`;
    }

    let months = _moment.default.monthsShort().map((m, i) => `<month value="${i}">${m}</month>`).join("\n");

    this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    temp.innerHTML = `
			<style>${styles.cssText}</style>
			<main>
				<header>
					<h4 class="selected-year">Year</h4>
					<a class="today">Today</a>
					<h1 class="selected-date">Date, Day</h1>
				</header>
				<section>
					<nav>
						<svg class="back" focusable="false" viewBox="0 0 24 24">
							<path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
							<path fill="none" d="M0 0h24v24H0V0z"></path>
						</svg>
						<div class="viewing-month">Month</div>
						<svg class="forward" focusable="false" viewBox="0 0 24 24">
							<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
							<path fill="none" d="M0 0h24v24H0V0z"></path>
						</svg>
					</nav>
					<header>${htmlDaysHeader}</header>
					<div class="days"></div>
                    <years>${years}</years>
                    <months>${months}</months>
				</section>
			</main>`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    this._yearEl = this.$('.selected-year');
    this._dateEl = this.$('.selected-date');
    this._monthEl = this.$('.viewing-month');
    this._monthDays = this.$('main .days');
    this.shadowRoot.addEventListener('click', this._onClick.bind(this));
  }

  connectedCallback() {
    this._setDate(this.value);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(val) {
    this._setDate(val);
  }

  get format() {
    return this.getAttribute('format') || 'MM/DD/YYYY';
  }

  set format(val) {
    this.setAttribute('format', val);
  }

  get date() {
    return this._dateSelected.clone();
  }

  get isValid() {
    return this._dateSelected.isValid();
  }

  formatted(format) {
    if (format === undefined) format = this.format;
    return this._dateSelected.format(format);
  }

  _renderMonth() {
    let start = this._date.weekday();

    let numDays = this._date.daysInMonth();

    let days = new Array(7 * 6).fill('');
    let i = 0;

    while (i < numDays) {
      days[i + start] = ++i;
    }

    this._monthDays.innerHTML = days.map(day => `<day value="${day}">${day}</day>`).join("\n");
    this._monthEl.innerHTML = this._date.format('MMMM YYYY');

    if (this._lookingAtSelectedMonth) {
      let elSelected = this.$(`day[value="${this._dateSelected.date()}"]`);
      if (elSelected) elSelected.setAttribute('active', '');
    }

    if (this._lookingAtToday) {
      let el = this.$(`day[value="${this._today.date()}"]`);
      if (el) el.setAttribute('today', '');
    }
  }

  nextMonth() {
    this._date.add('month', 1);

    this._renderMonth();
  }

  prevMonth() {
    this._date.add('month', -1);

    this._renderMonth();
  }

  pickYear(show = true) {
    this.pickMonth(false);

    if (show) {
      this.$('main').classList.add('pick-year');
      let activeYear = this.$('year[active]');
      if (activeYear) activeYear.scrollIntoView();
    } else this.$('main').classList.remove('pick-year');
  }

  pickMonth(show = true) {
    if (show) {
      this.$('main').classList.add('pick-month');
    } else this.$('main').classList.remove('pick-month');
  }

  $(str) {
    return this.shadowRoot.querySelector(str);
  }

  $$(str) {
    return this.shadowRoot.querySelectorAll(str);
  }

  _onClick(e) {
    if (e.target.tagName == 'DAY') {
      let val = e.target.getAttribute('value');

      if (val) {
        this._setDate({
          year: this._date.year(),
          month: this._date.month(),
          date: val
        });
      }

      return;
    }

    if (e.target.tagName == 'YEAR') {
      let val = e.target.getAttribute('value');

      if (val) {
        this._setDate({
          year: val
        });

        this.pickYear(false);
      }

      return;
    }

    if (e.target.tagName == 'MONTH') {
      let val = e.target.getAttribute('value');

      if (val) {
        this._setDate({
          date: 1,
          month: val
        });

        this.pickMonth(false);
      }

      return;
    }

    if (e.target.classList.contains('selected-year')) return this.pickYear();
    if (e.target.classList.contains('selected-date')) return this.pickYear(false);

    if (e.target.classList.contains('today')) {
      this.pickMonth(false);
      this.pickYear(false);
      return this._setDate();
    }

    if (e.target.classList.contains('viewing-month')) return this.pickMonth();

    if (e.target.tagName == 'svg') {
      e.target.classList.contains('back') ? this.prevMonth() : this.nextMonth();
      return;
    }
  }

  get _lookingAtToday() {
    this._today = this._today || (0, _moment.default)();
    return this._date.year() == this._today.year() && this._date.month() == this._today.month();
  }

  get _lookingAtSelectedMonth() {
    this._today = this._today || (0, _moment.default)();
    return this._date.year() == this._dateSelected.year() && this._date.month() == this._dateSelected.month();
  }

  _setDate(val) {
    if (val && typeof val == 'object') {
      this._dateSelected.set(val);

      this._date.set(val);

      changeEvent(this, val);
    } else {
      this._date = val ? (0, _moment.default)(val, this.format) : (0, _moment.default)();
      this._dateSelected = this._date.clone();
    }

    this._date.set({
      date: 1
    });

    this._renderMonth();

    this._refresh();
  }

  _refresh() {
    if (this._dateSelected.isValid()) this.removeAttribute('invalid');else this.setAttribute('invalid', '');
    this.setAttribute('value', this.formatted());
    this.$$('[active]').forEach(el => el.removeAttribute('active'));

    if (!this._dateSelected.isValid()) {
      this._yearEl.innerHTML = '–';
      this._dateEl.innerHTML = 'Invalid';
      return;
    }

    if (this._lookingAtSelectedMonth) {
      let el = this.$(`day[value="${this._dateSelected.date()}"]`);
      if (el) el.setAttribute('active', '');
    }

    let yearEl = this.$(`year[value="${this._dateSelected.year()}"]`);

    if (yearEl) {
      yearEl.setAttribute('active', '');
    }

    let monthEl = this.$(`month[value="${this._dateSelected.month()}"]`);

    if (monthEl) {
      monthEl.setAttribute('active', '');
    }

    this._yearEl.innerHTML = this._dateSelected.year();
    this._dateEl.innerHTML = this.formatted('ddd, MMM D');
  }

}

customElements.define('date-picker', DatePickerElement);

var _default = customElements.get('date-picker');

exports.default = _default;
},{"moment":"a2/B","lit-element":"+bhx"}],"2ezN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _moment = _interopRequireDefault(require("moment"));

var _dialog = _interopRequireDefault(require("../../dialog"));

require("./date-picker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styles = _litElement.css`
:host {
	display: inline-block;
	contain: content;
	min-width: .25em;
}

:host(:not([disabled])){
	cursor: text;
}

:host(:not([disabled])) main ::selection {
	background: var(--selectionBgd, #FFF8E1);
}

main {
	display: flex;
}

.editor {
	outline: none;
	width: 100%;
	display: inline-block;
	white-space: pre-wrap;
	min-height: 1em;
	line-height: 1.2em;
	margin: -.1em 0;
}

/* :host([single-line]) .editor {
	white-space: nowrap;
	overflow-x: auto;
	overflow-x: -moz-scrollbars-none; 
}

:host([single-line]) .editor::-webkit-scrollbar {
	width: 0 !important;
} */

.editor:empty:before {
	content: attr(data-placeholder);
	color: var(--placeholderColor);
}

.calendar {
	display: none;
	opacity: .3;
	height: 1.2em;
    margin: -0.3em -.5em -.5em 0;
    padding: .25em;
	cursor: pointer;
}

:host([type="date"]) .calendar {
	display: inline-block;
}

.calendar:hover,
.calendar.popover-open {
	opacity: .7;
}`;

class TextFieldElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    let placeholder = this.getAttribute('placeholder') || '';
    temp.innerHTML = `<style>${styles.cssText}</style>
			<main>
				<div class="editor" contenteditable="true" data-placeholder="${placeholder}"></div>
				<b-icon name="calendar-3" class="calendar"></b-icon>
			</main>
			<slot id="value"></slot>`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    let value = this.$('#value');
    this._val = value.assignedNodes().map(el => el.textContent.trim()).join(' ');
    this._val = this._val.replace(/^\n|\n$/g, '').trim();
    this._editor = this.$('.editor');

    if (this.type == 'date') {
      this._datePicker = document.createElement('date-picker');
      this._datePicker.value = this.value;
      this._datePicker.format = this.getAttribute('format') || 'MM/DD/YYYY';

      if (!this._datePicker.isValid) {
        let date = (0, _moment.default)(this._val);
        this._val = this._datePicker.value = date.format(this._datePicker.format);
      }
    }

    this._editor.innerHTML = this._val;
    this.innerText = '';

    this._editor.addEventListener('paste', this._onPaste.bind(this), true);

    this._editor.addEventListener('keydown', this._onKeypress.bind(this), true);

    this._editor.addEventListener('focus', this._onFocus.bind(this));

    this._editor.addEventListener('blur', this._onBlur.bind(this));

    this.shadowRoot.addEventListener('click', this._onClick.bind(this));
    this.addEventListener('click', this._onClick.bind(this));
  }

  $(str) {
    return this.shadowRoot.querySelector(str);
  }

  $$(str) {
    return this.shadowRoot.querySelectorAll(str);
  }

  connectedCallback() {
    this._setClassNames();
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ['disabled', 'placeholder'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') this._editor.contentEditable = !this.disabled;
    if (name === 'placeholder') this._editor.dataset.placeholder = newValue;
  }

  get type() {
    return this.getAttribute('type');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val = true) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get value() {
    return this._val;
  }

  get textValue() {
    if (!this.value) return this.value;
    let doc = new DOMParser().parseFromString(this.value, 'text/html');
    return Array.from(doc.body.childNodes).map(node => node.nodeValue || node.innerText).join("\n");
  }

  set value(val) {
    this._oldVal = this._val;

    if (this.hasAttribute('default') && !val) {
      val = this.getAttribute('default');
      this._val = val;
      let selection = this.select();
      document.execCommand('insertText', false, val);
      selection.removeAllRanges();
    } else {
      if (this.type == 'date') {
        this._datePicker.value = val;

        if (!this._datePicker.isValid) {
          let date = (0, _moment.default)(val);
          val = this._datePicker.value = date.format(this._datePicker.format);
        }

        if (!this._datePicker.isValid) {
          val = this._val;
          this._datePicker.value = val;
        }
      }

      this._val = val;
      if (this._editor.innerHTML != val) this._editor.innerHTML = val;
    }

    this._setClassNames();
  }

  get dbValue() {
    if (this._datePicker) return this.value ? this._datePicker.formatted('YYYY-MM-DD') : this.value;
    return this.value;
  }

  get currentValue() {
    if (this.hasAttribute('html')) return this._editor.innerHTML;
    return this._editor.innerText || this._editor.innerHTML;
  }

  set isInvalid(invalid) {
    this._isInvalid = invalid;
    if (invalid) this.setAttribute('invalid', true);else this.removeAttribute('invalid');
  }

  get isInvalid() {
    return this._isInvalid;
  }

  get isFocused() {
    return this.shadowRoot.activeElement == this._editor;
  }

  _setClassNames() {
    if (!this._val || this._val === '0') this.setAttribute('falsy', true);else this.removeAttribute('falsy');
    if (!this._val) this.setAttribute('no-value', true);else this.removeAttribute('no-value');
    if (!this._val && !this.getAttribute('placeholder')) this.setAttribute('empty', true);else this.removeAttribute('empty');
  }

  _onClick(e) {
    // was calendar icon clicked?
    if (e.target.classList.contains('calendar')) {
      e.stopPropagation();
      return this.pickDate();
    }

    if (e.target != this) return;
    if (!e.target.isFocused) this.focus();
  }

  async pickDate() {
    this._datePicker.value = this.value;
    let picker = new _dialog.default({
      view: this._datePicker,
      btns: ['cancel', 'ok']
    });

    if (await picker.popover(this.$('.calendar'), {
      align: 'left',
      overflowBoundry: 'window',
      maxHeight: false
    })) {
      this._changeValue(picker.$('date-picker').value);
    }
  }

  _onPaste(e) {
    e.preventDefault();
    let val = e.clipboardData.getData('text');
    document.execCommand('inserttext', false, val);
  }

  select(range = 'all') {
    let el = this._editor,
        s = window.getSelection(),
        r = document.createRange();

    if (range == 'start') {
      r.setStart(el, 0);
      r.setEnd(el, 0);
    } else if (range == 'end') {
      r.setStart(el, el.childNodes.length);
      r.setEnd(el, el.childNodes.length);
    } else {
      r.selectNodeContents(el);
    }

    s.removeAllRanges();
    s.addRange(r);
    return s;
  }

  _onKeypress(e) {
    let stop = false;
    this.isInvalid = false;

    if (e.key == 'Enter' && !this.hasAttribute('multiline')) {
      stop = true;
      this.dispatchEvent(new Event("change")); // Force change event for empty search/ re-search

      this.blur(); // will trigger a change if there is one
    }

    if (e.key == 'Escape') {
      this.value = this.value; // reset the value

      this.blur();
    }

    let max = this.getAttribute('max');
    if (max && this._editor.innerText.length >= max) stop = true;
    let delay = this.getAttribute('change-delay');
    clearTimeout(this._changeDelay);

    if (delay !== null) {
      delay = delay || 500;
      this._changeDelay = setTimeout(this._onBlur.bind(this), delay);
    }

    if (stop) {
      e.preventDefault();
    } else if (!this.hasAttribute('bubble-keypress')) {
      e.stopPropagation();
    }
  }

  _onFocus() {}

  focus() {
    this.select();
  }

  validate(val) {
    let required = this.hasAttribute('required');
    let validate = this.getAttribute('validate');
    if (!validate) return required ? !!val : true;

    switch (validate) {
      case 'int':
        validate = '^\\d+$';
        break;

      case 'float':
      case 'decimal':
        validate = '^\\d+(\\.\\d*)?$|^\\.\\d+$';
        break;

      case 'email':
        validate = '^\\S+@\\S+\\.\\S+$';
        break;
    }

    return !required && !val ? true : new RegExp(validate).test(val);
  }

  _onBlur() {
    let val = this.currentValue;

    if (!this.validate(val)) {
      if (this.hasAttribute('reset-invalid')) {
        this.value = this.value;
      } else {
        this.value = val;
        this.isInvalid = true;

        this._setClassNames();
      } // }else{
      // 	
      // 	this.focus()
      // }


      return;
    }

    if (val == this.value) return;
    let max = this.getAttribute('max');
    if (max) val = val.slice(0, max);

    this._changeValue(val);
  }

  _changeValue(val) {
    this.value = val;
    var event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        oldVal: this._oldVal
      }
    });
    this.dispatchEvent(event);
  }

}

customElements.define('text-field', TextFieldElement);

var _default = customElements.get('text-field');

exports.default = _default;
},{"lit-element":"+bhx","moment":"a2/B","../../dialog":"pos3","./date-picker":"VxKk"}],"h8fl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _menu = _interopRequireDefault(require("../../menu"));

var _device = _interopRequireDefault(require("../../../util/device"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
	Select Field
*/
const styles = _litElement.css`

:host(:not([disabled])) {
	cursor: pointer;
}

main {
	display: flex;
	align-items: center;
	min-width: 1em;
}

main > svg {
	height: 1em;
	width: 1em;
	flex-shrink: 0;
}

slot#options {
	display: none;
}

main input {
	position: absolute;
	z-index: -1;
	opacity: 0;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
}


#value {
	flex-grow: 1;
	min-width: 1em;
}

#value:empty:before {
	content: attr(data-placeholder);
	color: var(--placeholderColor);
}

#value > span {
	display: inline-block;
	padding: 0;
    min-width: 1em;
	vertical-align: bottom;
}

:host(:not([chip])) #value > span:not(:last-child):after {
	content: ', ';
	margin-right: .5em;
}

:host([chip]) #value {
	margin-top: -.15em;
	margin-bottom: -.15em;
}

:host([chip]) #value > span {
	background: rgba(0,0,0,.1);
    margin: .1em;
    padding: .15em .5em;
    border-radius: 20px;
	line-height: 1em;
	display: inline-flex;
	justify-content: center;
	align-items: center;
}`;

class SelectFieldElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    let placeholder = this.getAttribute('placeholder') || '';
    let arrow = this.hasAttribute('no-arrow') ? '' : '<svg focusable="false" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path></svg>';
    temp.innerHTML = `<style>${styles.cssText}</style>
			<main>
				<input type="input" readonly="true"/>
				<div id="value" data-placeholder="${placeholder}"></div>
				${arrow}
			</main>
			<slot id="options"></slot>`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    this._input = this.$('input');
    this._value = this.$('#value');
    this._selected = [];
    let options = this.$('#options');
    this.options = [];
    options.assignedNodes && options.assignedNodes().map(el => {
      if (!el.tagName) return;
      if (el.tagName == 'HR') return this.options.push('divider');
      if (el.tagName == 'OPTGROUP') return this.options.push({
        'divider': el.innerHTML
      });

      if (el.tagName != 'OPTION') {
        return this.options.push({
          'text': el.innerHTML
        });
      }

      if (el.hasAttribute('selected')) this._selected.push(el.value);
      let attrs = {};
      Array.from(el.attributes).forEach(attr => {
        if (!['value', 'selected'].includes(attr.name)) attrs[attr.name] = attr.value;
      });
      this.options.push(Object.assign(attrs, {
        label: el.innerHTML,
        val: el.value || null
      }));
    });
    this.addEventListener('click', this.focus.bind(this));
    this.addEventListener('keypress', this.onKeypress.bind(this));
  }

  onKeypress(e) {
    if (e.code == 'Space') {
      this.toggleMenu();
    }
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') this._input.disabled = this.disabled;
  }

  setAttributes() {
    if (this.isEmpty && !this.showEmpty && !this.getAttribute('placeholder')) this.setAttribute('empty', true);else this.removeAttribute('empty');
  }

  $(str) {
    return this.shadowRoot.querySelector(str);
  }

  $$(str) {
    return this.shadowRoot.querySelectorAll(str);
  }

  connectedCallback() {
    this.selected = this._selected;
  }

  disconnectedCallback() {}

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val = true) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }

  get showEmpty() {
    return this.hasAttribute('show-empty');
  }

  get value() {
    if (this.multiple) return this.selected && this.selected.map(m => m.val);else return this.selected && this.selected.val;
  }

  set value(val) {
    this.selected = val;
  }

  get isEmpty() {
    let val = this.value;
    return this.multiple ? val.length <= 1 && !val[0] : !val;
  }

  set isInvalid(invalid) {
    this._isInvalid = invalid;
    if (invalid) this.setAttribute('invalid', true);else this.removeAttribute('invalid');
  }

  get isInvalid() {
    return this._isInvalid;
  }

  set options(opts) {
    if (opts instanceof Promise) {
      opts.then(result => {
        this.options = result;
        return result;
      });
      opts = []; // clear options until promise resolves
    }

    if (Array.isArray(opts)) opts = opts.map(o => {
      if (typeof o == 'string') return {
        label: o,
        val: o
      };
      return o;
    });
    this.__options = opts;
    this.selected = this._selected;
  }

  get options() {
    return this.__options;
  }

  set selected(val) {
    this._oldSelected = this._selected.slice(0);
    if (!val) val = [];else if (!Array.isArray(val)) val = [val];
    let selected = this.options.filter(m => {
      return val.includes(m.val) || val.length == 0 && !m.val;
    }); // keep selected values in the order that they were selected

    selected = selected.sort((a, b) => {
      return val.indexOf(a.val) - val.indexOf(b.val);
    });
    this._selected = []; // if no options, keep the selected value
    // FIXME: could be improved with the `labels`

    if (this.options.length == 0) this._selected = val;
    let labels = '';
    selected.forEach(m => {
      this._selected.push(m.val);

      if (m.val || this.showEmpty) labels += `<span value="${m.val}">${m.label}</span>`;
    });
    this._value.innerHTML = labels;
    this.setAttribute('value', val.join(','));
    this.setAttributes();
  }

  get selected() {
    let selected = this.options.filter(m => {
      return this._selected.includes(m.val);
    }); // keep selected values in the order that they were selected

    selected = selected.sort((a, b) => {
      return this._selected.indexOf(a.val) - this._selected.indexOf(b.val);
    });
    return this.multiple ? selected : selected[0];
  }

  get isFocused() {
    return this.shadowRoot.activeElement == this._input || this.hasAttribute('focused');
  }

  focus() {
    this.toggleMenu();
  }

  set focused(focused) {
    if (focused) {
      this._input.focus();

      this.setAttribute('focused', '');
    } else {
      this._input.blur();

      this.removeAttribute('focused');
    }
  }

  async toggleMenu() {
    if (this.disabled) return;

    if (this.openMenu) {
      this.openMenu.resolve(false);
      return;
    }

    this.focused = true;
    let menuOpts = {
      minW: this.offsetWidth,
      selected: this._selected,
      multiple: this.multiple,
      jumpNav: this.hasAttribute('jump-nav'),
      // only called when in multiple mode
      onSelect: selected => {
        this.selected = selected.map(m => m.val);
      }
    };
    let menu = this.options;
    let popoverOpts = {
      align: this.getAttribute('menu-align') || 'bottom',
      maxHeight: this.getAttribute('menu-max-height') || 'auto',
      maxWidth: this.getAttribute('menu-max-width') || 'none',
      overflowBoundry: this.getAttribute('menu-overflow') ? 'window' : null
    };
    if (!menu || menu.length == 0) menu = [{
      'divider': 'No options available'
    }];
    this.openMenu = new _menu.default(menu, menuOpts);
    this.openMenu.el.setAttribute('select-field', this.className);
    let val = undefined;
    if (_device.default.is_mobile) val = await this.openMenu.modal({
      closeBtn: true
    });else val = await this.openMenu.popover(this.$('main'), popoverOpts);
    this.openMenu = null;
    this.focused = false;
    if (!_device.default.is_mobile) this._input.focus(); // retain focus

    if (val === false) return;
    val = this.multiple ? val : [val];
    this.selected = val.map(m => m.val);
    var event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value
      }
    });
    this.dispatchEvent(event);
  }

}

customElements.define('select-field', SelectFieldElement);

var _default = customElements.get('select-field');

exports.default = _default;
},{"lit-element":"+bhx","../../menu":"0tCY","../../../util/device":"la8o"}],"GLLF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

const styles = _litElement.css`

:host {
	--size: 1.6em;
	--color: #2196f3;
	--colorDisabled: rgba(0, 0, 0, 0.26);
	display: inline-block;
	vertical-align: middle;
}

:host(.control) {
	flex-grow: 0 !important;
}

:host([active]) svg.inactive,
:host(:not([active])) svg.active {
	display: none
}

main {
	display: flex;
	align-items: center;
	cursor: pointer;
}

:host([placement="top"]) main { flex-direction: column-reverse; }
:host([placement="bottom"]) main { flex-direction: column; }
:host([placement="left"]) main { flex-direction: row-reverse; }
:host([placement="right"]) main { flex-direction: row; }

svg {
	fill: currentColor;
	width: var(--size);
	height: var(--size);
	display: inline-block;
	transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	user-select: none;
	flex-shrink: 0;
	padding: .25em;
}

svg.active {
	fill: var(--color);
}

:host([disabled]) svg {
	fill: var(--colorDisabled);
}

:host([disabled]) label {
	color: var(--colorDisabled);
}

main label {
	cursor: pointer;
}`;

class RadioBtnElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    let label = this.getAttribute('label') || '<slot name="label"></slot>';
    temp.innerHTML = `<style>${styles.cssText}</style>
			<main>
				<svg class="inactive" focusable="false" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
				<svg class="active" focusable="false" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
				<label>${label}</label>
			</main>
			`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
    this.addEventListener('click', this._onClick.bind(this));
  }

  _onClick() {
    if (this.disabled) return;
    this.active = !this.active;
    var event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value
      }
    });
    this.dispatchEvent(event);
  }

  set active(val) {
    val ? this.setAttribute('active', '') : this.removeAttribute('active');
  }

  get active() {
    return this.hasAttribute('active');
  }

  get value() {
    return this.hasAttribute('value') ? this.getAttribute('value') || null : this.getAttribute('label');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val = true) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

}

customElements.define('radio-btn', RadioBtnElement);

var _default = customElements.get('radio-btn');

exports.default = _default;
},{"lit-element":"+bhx"}],"mCnW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class RadioGroupElement extends HTMLElement {
  constructor() {
    super(); // let shadow = this.attachShadow({mode: 'open'})
    // let temp = document.createElement('template')
    // temp.innerHTML = `<style>${styles}</style>`
    // this.shadowRoot.appendChild(temp.content.cloneNode(true));

    this.addEventListener('change', this._onChange.bind(this), true);
    this.addEventListener('keydown', e => {
      if (['ArrowLeft', 'ArrowUp'].includes(e.code)) {
        this.nav(-1);
      } else if (['ArrowRight', 'ArrowDown'].includes(e.code)) {
        this.nav(1);
      }
    });
    this.radios = Array.from(this.querySelectorAll('radio-btn'));
  }

  connectedCallback() {
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
  }

  nav(dir = 1) {
    let i = this.radios.indexOf(this.active);
    if (i == undefined) i = dir < 0 ? this.radios.length - 1 : 0;else i += dir;
    if (i >= this.radios.length) i = 0;else if (i < 0) i = this.radios.length - 1;
    this.value = this.radios[i].value;
  }

  _onChange(e) {
    if (e.target == this) return;
    this.value = e.target.value;
    e.stopPropagation();
    var event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value
      }
    });
    this.dispatchEvent(event);
  }

  get active() {
    return this.radios.find(el => el.active);
  }

  get value() {
    let radio = this.active;
    return radio && radio.value;
  }

  set value(val) {
    this.radios.forEach(el => {
      if (el.value == val) el.active = true;else el.active = false;
    });
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val = true) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
    this.radios.forEach(el => el.disabled = val);
  }

}

customElements.define('radio-group', RadioGroupElement);

var _default = customElements.get('radio-group');

exports.default = _default;
},{}],"uH6r":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

const styles = _litElement.css`

:host {
	opacity: 0;
	position: absolute;
	/* left: -7px;
	top: -7px;
	width: 48px;
	height: 48px; */
	width: 120%;
	height: 120%;
	left: -10%;
	top: -10%;
	display: block;
	z-index: 100;
	background: currentColor;
	border-radius: 50px;
}

:host(.enter) {
	opacity: 0.3;
	/* transform: scale(.5); */
	animation: ripple-enter 550ms cubic-bezier(0.4, 0, 0.2, 1);
	animation-name: ripple-enter;
}

:host(.exit) {
	opacity: 0;
	/* transform: scale(1); */
	animation: ripple-exit 550ms cubic-bezier(0.4, 0, 0.2, 1);
	animation-name: ripple-exit;
}


@-webkit-keyframes ripple-enter {
  0% {
    opacity: 0.1;
    transform: scale(0);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}
@-webkit-keyframes ripple-exit {
  0% {
    opacity: .3;
	transform: scale(.7);
  }
  100% {
    opacity: 0;
	transform: scale(1.2);
  }
}
@-webkit-keyframes ripple-pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}
`;

class TouchRippleElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: 'open'
    });
    let temp = document.createElement('template');
    temp.innerHTML = `
			<style>${styles.cssText}</style>
		`;
    this.shadowRoot.appendChild(temp.content.cloneNode(true));
  }

  ripple() {
    this.animate('exit');
  }

  enter() {
    this.classList.add('enter');
  }

  hide() {
    this.classList.remove('exit');
    this.classList.remove('enter');
  }

  animate(str) {
    this.hide();
    this.classList.add(str);
    setTimeout(() => this.classList.remove(str), 550);
  }

}

customElements.define('touch-ripple', TouchRippleElement);

var _default = customElements.get('touch-ripple');

exports.default = _default;
},{"lit-element":"+bhx"}],"wbVn":[function(require,module,exports) {
"use strict";

require("./form-handler");

require("./form-control");

require("./controls/text-field");

require("./controls/select-field");

require("./controls/check-box");

require("./controls/radio-btn");

require("./controls/radio-group");

require("./controls/touch-ripple");

require("./controls/range-slider");
},{"./form-handler":"ZQnj","./form-control":"swB1","./controls/text-field":"2ezN","./controls/select-field":"h8fl","./controls/check-box":"jNfL","./controls/radio-btn":"GLLF","./controls/radio-group":"mCnW","./controls/touch-ripple":"uH6r","./controls/range-slider":"ZCfn"}],"Wr69":[function(require,module,exports) {

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],"zXhY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _componentEmitter = _interopRequireDefault(require("component-emitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataSource {
  constructor(opts = {}) {
    this.reset();
    this.opts = Object.assign({
      perPage: 30,
      fetch: true
    }, opts);
  }

  reset() {
    this._pageFetched = null;
    this.lastFiltered = 0;
    this._rawData = []; // unaltered data from server

    this._filteredData = []; // raw data with after filters applied

    this.data = []; // filtered data with "search term" applied
  }

  async refilter() {
    this.lastFiltered = 0;
    this._rawData = this.coll.models || this.coll;
    this._filteredData = this._rawData;
    this.data = this._rawData;
    await this.applyFilters();
  }

  get perPage() {
    return this.opts.perPage;
  }

  async length() {
    if (this._fetching) await this._fetching;
    return this.data.length;
  }

  at(i) {
    return this.data[i];
  }

  first(i) {
    return this.data[0];
  }

  last() {
    return this.data[this.data.length - 1];
  }

  forEach(fn) {
    return this.data.forEach(fn);
  }

  map(fn) {
    return this.data.map(fn);
  }

  flatMap(fn) {
    return this.data.flatMap(fn);
  }

  filter(fn) {
    return this.data.filter(fn);
  }

  reduce(fn, start = 0) {
    return this.data.reduce(fn, start);
  }

  async _fetchFromServer(pageAt) {
    // TODO: support fetching data with `fetch` and a url?
    if (this.coll && this.coll.fetchSync) {
      let data = {
        term: this.filters.term || ''
      };

      if (this.opts.fetch == 'more') {
        data.pageAt = pageAt;
        data.perPage = this.perPage;
      }

      if (this.filters) data.filters = this.filters.value();
      await this.coll.fetchSync({
        data: data
      });
    }
  }

  fetch(pageAt) {
    return this._fetching = new Promise(async resolve => {
      if (pageAt == 0 && this._rawData.length == 0 || this._pageFetched != pageAt && this._rawData.length == pageAt && this.opts.fetch == 'more') {
        this._pageFetched = pageAt;
        if (this.opts.fetch) await this._fetchFromServer(pageAt);
        await this.refilter();
      }

      if (this._rawData.length > pageAt) this.emit('change:count', this._rawData.length);
      if (this._filtering) await this._filtering;
      if (this._sorting) await this._sorting;
      resolve(this.data.slice(pageAt, pageAt + this.opts.perPage));
    }).finally(_ => delete this._fetching);
  }

  applyFilters() {
    return this._filtering = new Promise(async resolve => {
      if (!this.filters) return resolve(this.data);

      if (this.lastFiltered < this.filters.lastChanged) {
        this.data = await this.filters.filter(this._rawData);
        await this.sort();
        this._filteredData = this.data;
      }

      this.data = await this.filters.filterByTerm(this._filteredData);
      resolve(this.data);
      this.lastFiltered = new Date().getTime();
    }).finally(_ => delete this._filtering);
  }

  sort() {
    return this._sorting = new Promise(async resolve => {
      if (!this.sorts) return resolve(this.data);
      this.data = await this.sorts.sort(this.data);
      resolve(this.data);
    }).finally(_ => delete this._sorting);
  }

}

exports.default = DataSource;
(0, _componentEmitter.default)(DataSource.prototype);
},{"component-emitter":"Wr69"}],"BblM":[function(require,module,exports) {
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],"p/0c":[function(require,module,exports) {
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],"3w4y":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":"wppe","./_arrayMap":"BblM","./isArray":"p/0c","./isSymbol":"bgO7"}],"A8RV":[function(require,module,exports) {
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":"3w4y"}],"Chbn":[function(require,module,exports) {
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],"5Kr2":[function(require,module,exports) {
var baseSlice = require('./_baseSlice');

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;

},{"./_baseSlice":"Chbn"}],"oxMD":[function(require,module,exports) {
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;

},{}],"ACee":[function(require,module,exports) {
/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;

},{}],"NN+K":[function(require,module,exports) {
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;

},{}],"smkV":[function(require,module,exports) {
var asciiToArray = require('./_asciiToArray'),
    hasUnicode = require('./_hasUnicode'),
    unicodeToArray = require('./_unicodeToArray');

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;

},{"./_asciiToArray":"ACee","./_hasUnicode":"oxMD","./_unicodeToArray":"NN+K"}],"prUu":[function(require,module,exports) {
var castSlice = require('./_castSlice'),
    hasUnicode = require('./_hasUnicode'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;

},{"./_castSlice":"5Kr2","./_hasUnicode":"oxMD","./_stringToArray":"smkV","./toString":"A8RV"}],"SwE8":[function(require,module,exports) {
var createCaseFirst = require('./_createCaseFirst');

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;

},{"./_createCaseFirst":"prUu"}],"NEda":[function(require,module,exports) {
var toString = require('./toString'),
    upperFirst = require('./upperFirst');

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

module.exports = capitalize;

},{"./toString":"A8RV","./upperFirst":"SwE8"}],"NUHt":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _capitalize = _interopRequireDefault(require("lodash/capitalize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = str => {
  return str.replace(/[\-_]/g, ' ').split(' ').map(word => (0, _capitalize.default)(word)).join(' ');
};

exports.default = _default;
},{"lodash/capitalize":"NEda"}],"YNHW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('b-list-filter-view-date', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: grid;
            position:relative;
            padding: .25em;
        }

        header {
            display: grid;
        }

        footer {
            display: flex;
            justify-content: flex-end;
        }

        b-btn {
            margin: .05em 0;
            padding: .1em;
        }

        b-btn:hover {
            --bgdColor: rgba(0, 0, 0, 0.1);
        }

        text-field {
            padding-right: .5em;
            margin-right: -.5em;
            /* width: 160px; */
        }

        b-hr {
            margin: .25em -.25em;
        }
        
        .controls {
            padding: .5em;
            font-size: 1.4em;
            display: flex;
            flex-direction: column;
        }

        form-control:first-child {
            margin-bottom: .35em;
        }
    `;
  }

  firstUpdated() {
    this.editors = this.shadowRoot.querySelectorAll('form-control');
    let value = this.filter.value;
    if (value) this.editors.forEach((el, i) => el.value = value[i]);
  }

  render() {
    return _litElement.html`

        <header>
            <b-btn text md @click=${this.clearDates}>Clear</b-btn>
            <b-hr></b-hr>
            <b-btn text md @click=${this.usePreset}>Today</b-btn>
            <b-btn text md @click=${this.usePreset}>Yesterday</b-btn>
            <b-btn text md @click=${this.usePreset}>30 Days</b-btn>
            <b-btn text md @click=${this.usePreset}>This Month</b-btn>
            <b-btn text md @click=${this.usePreset}>This Year</b-btn>
        </header>

        <b-hr></b-hr>

        <div class="controls">
            <form-control key="date1">
                <text-field reset-invalid placeholder="00/00/0000" type="date"></text-field>
            </form-control>

            <form-control key="date2">
                <text-field reset-invalid placeholder="00/00/0000" type="date"></text-field>
            </form-control>
        </div>
    `;
  }

  get value() {
    let value = []; // editors not setup yet, so just use the value from the filter object

    if (!this.editors) return this.filter.value;
    this.editors.forEach(el => {
      let v = el.dbValue;
      if (v) value.push(v);
    });
    if (value.length == 0) return null;
    if (value.length == 1) value = [value[0], value[0]];
    value.sort();
    return value;
  }

  set value(val) {
    if (!val || val.length == 0) val = [null, null];
    if (typeof val == 'string') val = [val, val];
    if (val.length == 0) val = [val[0], val[0]];
    this.editors.forEach((el, i) => {
      el.value = val[i] || null;
    });
  }
  /*
      We do a bunch of fancy logic to display a label that is hopefully
      the easy to scan while taking up the least amount of space
  */


  get label() {
    let val = this.value;
    if (!val) return '–';
    let [d1, d2] = val;
    let m = (0, _moment.default)().startOf('day');
    let m1 = (0, _moment.default)(d1);
    let m2 = (0, _moment.default)(d2);
    let thisYear = m1.year() == m.year() && m2.year() == m2.year();
    let sameYear = m1.year() == m2.year(); // single day selected

    if (d1 == d2) {
      let m1 = (0, _moment.default)(d1);
      if (m.isSame(m1)) return 'Today';
      let diffDays = m.diff(m1, 'days');
      if (diffDays == 1) return 'Yesterday';
      if (diffDays > 1 && diffDays <= 14) return diffDays + ' days ago'; // leave off the year since it's this year

      if (thisYear) return m1.format('MMM D');
      return m1.format('M/D/YY');
    } // month range (beginning of one month to end of another month)


    if (m1.date() == 1 && m2.date() == m2.clone().endOf('month').date()) {
      let month1 = m1.format('MMM');
      let month2 = m2.format('MMM');

      if (month1 == month2 && sameYear) {
        if (month1 == m.format('MMM') && thisYear) return 'This Month';
        if (thisYear) return month1;
        return month1 + ' ‘' + m1.format('YY');
      }

      if (thisYear && m1.month() == 0 && m2.month() == 11) return 'This Year';else if (thisYear) return month1 + ' - ' + month2;else if (sameYear) return month1 + ' - ' + month2 + ' ' + m2.format('YYYY');else return month1 + ' ‘' + m1.format('YY') + ' - ' + month2 + ' ‘' + m2.format('YY');
    } // leave off the year since it's this year


    if (thisYear) return m1.format('MMM D') + ' - ' + m2.format('MMM D');
    return m1.format('M/D/YY') + ' - ' + m2.format('M/D/YY');
  }

  clearDates() {
    this.value = null;
    this.close();
  }

  usePreset(e) {
    let preset = e.target.innerText;
    let values = [];
    let date = (0, _moment.default)();
    let format = 'YYYY-MM-DD';

    switch (preset) {
      case 'Today':
        values = [date.format(format)];
        break;

      case 'Yesterday':
        date.subtract('1', 'day');
        values = [date.format(format)];
        break;

      case '30 Days':
        values = [date.clone().subtract('30', 'day').format(format), date.format(format)];
        break;

      case 'This Month':
        values = [date.startOf('month').format(format), date.endOf('month').format(format)];
        break;

      case 'This Year':
        values = [date.startOf('year').format(format), date.endOf('year').format(format)];
        break;
    }

    this.value = values;
    this.close();
  }

});

var _default = customElements.get('b-list-filter-view-date');

exports.default = _default;
},{"lit-element":"+bhx","moment":"a2/B"}],"vufV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

customElements.define('b-list-filter-view-slider', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: grid;
            position:relative;
            padding: .25em;
        }

        range-slider {
            width: 100%;
            margin: 1em 1.5em .5em 1.5em;
        }
    `;
  }

  constructor(opts = {}) {
    super();
    this.opts = Object.assign({
      range: false,
      min: 0,
      max: 100,
      step: 1,
      label: 'show',
      width: '160px',
      prefix: '',
      suffix: ''
    }, opts);
  }

  render() {
    return _litElement.html`
        
        <b-btn text @click=${this.clearVal}>Clear</b-btn>

        <b-hr></b-hr>

        <range-slider 
            style="width:${this.opts.width}"
            @change=${this.onChange}
            ?range=${this.opts.range}
            min=${this.opts.min}
            max=${this.opts.max}
            step=${this.opts.step}
            label=${this.opts.label}
            .value=${this.value}
        ></range-slider>
    `;
  }

  clearVal() {
    this.value = null;
    this.shadowRoot.querySelector('range-slider').reset();
    this.close();
  }

  onChange(e) {
    this.value = e.target.value; // this.close()
  }

  get value() {
    if (this.__value === undefined) this.__value = this.filter.value || null;
    return this.__value;
  }

  set value(val) {
    // let oldVal = this.value
    this.__value = val; // this.requestUpdate('value', oldVal)
  }

  get label() {
    let val = this.value;
    if (val === null || val === '') return '–';
    let str = Array.isArray(val) ? val[0] == val[1] ? val[0] : val.join('-') : val;
    return this.opts.prefix + str + this.opts.suffix;
  }

});

var _default = customElements.get('b-list-filter-view-slider');

exports.default = _default;
},{"lit-element":"+bhx"}],"HGW8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Filter = exports.default = void 0;

var _menu = _interopRequireDefault(require("../../menu"));

var _dialog = _interopRequireDefault(require("../../dialog"));

var _popover = _interopRequireDefault(require("../../popover"));

var _titleize = _interopRequireDefault(require("../../../util/titleize"));

var _fuse = _interopRequireDefault(require("fuse.js"));

var _componentEmitter = _interopRequireDefault(require("component-emitter"));

var _filterViewDate = _interopRequireDefault(require("../toolbar/filter-view-date"));

var _filterViewSlider = _interopRequireDefault(require("../toolbar/filter-view-slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CustomViews = {
  'date': _filterViewDate.default,
  'slider': _filterViewSlider.default // do NOT include '0' or 'false' as unset values

};
const unsetValues = [undefined, null, ''];

const defaultSearch = model => {
  let data = {};
  ['id', 'title', 'name', 'label', 'file', 'dir'].forEach(key => {
    if (model.has !== undefined) {
      if (model.has(key)) data[key] = model.get(key);
    } else if (model[key] !== undefined) data[key] = model[key];
  });
  return data;
};

const defaultFilterby = (model, val, key) => {
  if (Array.isArray(val)) return val.includes(model.get(key));else return val == model.get(key);
};

class Filters extends Map {
  get _storeKey() {
    return 'b-list:' + this.key + ':filters';
  }

  reset() {
    this.queuing = false;
    let resetData = {};
    this.map(filter => {
      resetData[filter.key] = filter.defaultVal;
    });
    this.value(resetData);
  }

  value(key, val) {
    // first time getting value, get it from local storage
    if (this.__value === undefined) {
      this.__value = this.key && JSON.parse(localStorage.getItem(this._storeKey)) || {};
    } // SETTING


    if (val !== undefined || typeof key == 'object') {
      this.lastChanged = new Date().getTime(); // may be setting more than one value

      let changes = typeof key == 'object' ? key : {
        [key]: val
      };
      let didChange = [];

      for (let k in changes) {
        let changeFrom = this.__value[k];
        let changeTo = changes[k]; // is the selected value effectively "unset" (`multi` filters will be an array: `[null]` )

        if ([null, undefined].includes(changeTo) || Array.isArray(changeTo) && [null, undefined].includes(changeTo[0])) delete this.__value[k];else this.__value[k] = changeTo; // converting to JSON string so we can compare arrays

        if (JSON.stringify(this.__value[k]) != JSON.stringify(changeFrom)) {
          didChange.push(k);
        } else {
          delete changes[k];
        }
      }

      if (this.key) localStorage.setItem(this._storeKey, JSON.stringify(this.__value));

      if (didChange.length > 0) {
        // emit a change on each filter
        didChange.forEach(k => {
          this.get(k).emit('change', val);
        });
        if (this.queuing) this.queuedChanges = changes;else this.emit('change', changes);
      } // GETTING

    } else {
      return key ? this.__value[key] : this.__value;
    }
  }

  get queuing() {
    return this.__queue || false;
  }

  set queuing(val) {
    this.__queue = Boolean(val);

    if (!this.queuing && this.queuedChanges) {
      this.emit('change', this.queuedChanges);
      this.queuedChanges = null;
    }
  }

  get queuedChanges() {
    return this.__queuedChanges;
  }

  set queuedChanges(changes) {
    if (!changes) {
      delete this.__queuedChanges;
      this.emit('queuing', false);
      return;
    }

    this.__queuedChanges = Object.assign(this.__queuedChanges || {}, changes);
    this.emit('queuing', Object.keys(this.__queuedChanges).length);
  }

  use(filters) {
    if (filters == this.__lastFilters) return;
    this.__lastFilters = filters;
    this.forEach(filter => delete filter.parent);
    this.clear();

    for (let key in filters) {
      if (key == 'search') {
        this.searchOptions = filters[key];
        continue;
      }

      let filter = new Filter(key, filters[key]);
      filter.parent = this;
      this.set(key, filter);
    }

    this.lastChanged = new Date().getTime();
  }

  map(fn) {
    let resp = [];
    this.forEach((v, key) => resp.push(fn(v, key)));
    return resp;
  }

  set searchOptions(opts) {
    if (typeof opts == 'object') this.__searchOptions = opts;
  }

  get searchOptions() {
    return Object.assign({
      data: defaultSearch,
      includeMatches: true,
      minMatchCharLength: 3,
      threshold: 0.2,
      location: 0,
      distance: 100,
      placeholder: 'Search',
      delay: 0
    }, this.__searchOptions || {});
  }

  get showSearch() {
    return typeof this.searchOptions.data == 'function';
  }

  filterByTerm(data) {
    return new Promise(resolve => {
      let searchOptions = Object.assign({}, this.searchOptions);
      let keys = searchOptions.keys;
      data.forEach(m => {
        m.searchMatches = {};
      });
      if (!this.term || !searchOptions.data || this.term.length < searchOptions.minMatchCharLength) return resolve(data);
      data.forEach(m => {
        m._fuseSearch = searchOptions.data(m); // no search option keys set yet, so set them automatically

        if (!keys) keys = Object.keys(m._fuseSearch);
      }); // prefix all keys with `_fuseSearch.` so the data is searched properly
      // keys can be an array of strings or objects with name/weight

      if (keys) searchOptions.keys = keys.map(key => {
        if (typeof key == 'string') return '_fuseSearch.' + key;
        let newKey = Object.assign({}, key);
        newKey.name = '_fuseSearch.' + newKey.name;
        return newKey;
      });
      let fuse = new _fuse.default(data, searchOptions);
      data = fuse.search(this.term); // reformat to array of models

      if (searchOptions.includeMatches) data = data.map(d => {
        d.item.searchMatches = {};
        d.matches.forEach(m => {
          d.item.searchMatches[m.key.replace('_fuseSearch.', '')] = m.value;
        });
        return d.item;
      });
      resolve(data);
    });
  }

  async filter(data) {
    let filters = this.map(filter => filter); // apply each filter, waiting for the first one to finish before moving on to the next filter

    return filters.reduce((promise, filter) => {
      return promise.then(data => filter.filterData(data));
    }, Promise.resolve(data));
  }

  needsDatabaseFetch(changes) {
    for (let key in changes) {
      if (this.get(key).isDB) return true;
    }

    return false;
  }

}
/*
    Filter
*/


exports.default = Filters;

class Filter {
  constructor(key, attrs) {
    this.key = key;
    this.attrs = attrs;
  }

  get values() {
    // TODO: implement "context" for function?
    let values = this.attrs.values;
    values = typeof values == 'function' ? values.call(this.parent.list) : values;
    values = values.map(v => {
      if (typeof v == 'string' && !['divider'].includes(v)) v = {
        label: v,
        val: v // make "unset" values uniform

      };

      if (typeof v == 'object' && unsetValues.includes(v.val)) {
        v.val = null;
        v.clearsAll = true;
      }

      return v;
    });
    return values;
  }

  get label() {
    return this.attrs.label || (0, _titleize.default)(this.key);
  }

  get icon() {
    return this.attrs.icon || null;
  }

  get filterBy() {
    if (!this.attrs.filterBy && this.isCustomView && this.customView.filterBy) return this.customView.filterBy;
    return this.attrs.filterBy || defaultFilterby;
  } // is a database filter


  get isDB() {
    return this.attrs.db === true;
  }

  get isCustomView() {
    return !!this.attrs.view;
  }

  get isActive() {
    let val = this.isMulti ? this.value && this.value[0] : this.value;
    return !unsetValues.includes(val);
  }

  get isMulti() {
    return this.attrs.multi === true;
  }

  get value() {
    return this.parent.value(this.key);
  }

  set value(val) {
    this.parent.value(this.key, val);
  }

  get defaultVal() {
    if (this.attrs.defaultVal) return this.attrs.defaultVal;
    if (this.isCustomView) return this.customView.defaultVal ? this.customView.defaultVal : null;
    let first = this.values[0];
    return first ? first.val : null;
  }

  get valueLabel() {
    let val = this.value;

    if (this.isCustomView) {
      let view = this.customView;
      return view ? view.label : 'UNSUPORRTED';
    }

    let matchedVal = this.values.filter(v => {
      if (typeof v == 'string' || v.divider || v.text) return false; // return v.val==val

      return Array.isArray(val) ? val.includes(v.val) : v.val == val;
    });
    return matchedVal ? matchedVal.map(f => f.label).join(', ') : val;
  }

  async showMenu(el) {
    if (this.isCustomView) return this.showCustomView(el);
    let selected = await new _menu.default(this.values, {
      selected: this.value,
      multiple: this.isMulti
    }).popover(el, {
      maxHeight: this.attrs.maxHeight || '60vh'
    });
    let oldVal = this.value;
    if (selected === false || selected.length == 0) return; // this.value = null
    else if (Array.isArray(selected)) this.value = selected.map(s => s.val);else this.value = selected.val;
  }

  get customView() {
    let viewName = this.attrs.view;
    let View = null;

    if (!this._customView) {
      if (CustomViews[viewName]) {
        View = CustomViews[viewName];
      } else if (typeof viewName == 'string') {
        View = customElements.get(viewName);
      } else if (typeof viewName == HTMLElement) {
        View = viewName;
      }

      if (View) {
        View.prototype.close = function () {
          this.popover._close(); // to trigger onClose

        };

        this._customView = new View(this.attrs.viewOpts || {});
        this._customView.filter = this;
      }
    }

    return this._customView;
  }

  async showCustomView(el) {
    if (!this.customView) return _dialog.default.warn({
      msg: `${this.key}: unsupported view`
    }).popover(el);

    let onClose = _ => {
      this.value = this.customView.value;
    };

    new _popover.default(el, this.customView, {
      onClose: onClose
    });
  }

  filterData(data) {
    return new Promise(resolve => {
      // pass through the data unchanged if any of these are met
      if (!this.isActive) return resolve(data);
      if (!this.filterBy) return resolve(data);
      if (this.isDB) return resolve(data);
      let val = this.value;
      data = data.filter(m => this.filterBy.call(this.parent.list, m, val, this.key));
      resolve(data);
    });
  }

}

exports.Filter = Filter;
(0, _componentEmitter.default)(Filters.prototype);
(0, _componentEmitter.default)(Filter.prototype);
},{"../../menu":"0tCY","../../dialog":"pos3","../../popover":"Soyf","../../../util/titleize":"NUHt","fuse.js":"Wp9p","component-emitter":"Wr69","../toolbar/filter-view-date":"YNHW","../toolbar/filter-view-slider":"vufV"}],"4sAK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _menu = _interopRequireDefault(require("../../menu"));

var _titleize = _interopRequireDefault(require("../../../util/titleize"));

var _componentEmitter = _interopRequireDefault(require("component-emitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Sorts extends Map {
  get _storeKey() {
    return 'b-list:' + this.key + ':sort';
  }

  get value() {
    // first time getting value, get it from local storage
    if (this.__value === undefined) {
      this.__value = this.key && JSON.parse(localStorage.getItem(this._storeKey)) || {};
    }

    return this.__value;
  }

  set value(val) {
    let didChange = JSON.stringify(this.__value) != JSON.stringify(val);
    this.__value = val;

    if (this.key) {
      if (val == null || val == undefined) localStorage.removeItem(this._storeKey);else localStorage.setItem(this._storeKey, JSON.stringify(val));
    }

    this.forEach(sort => sort.selected = this.value[sort.key]);
    if (didChange) this.emit('change', val);
  }

  use(sorts) {
    if (sorts == this.__lastSorts) return;
    this.__lastSorts = sorts;
    this.clear();

    for (let key in sorts) {
      let sort = new Sort(key, sorts[key]);
      sort.selected = this.value[key];
      this.set(key, sort);
    }
  }

  map(fn) {
    let resp = [];
    this.forEach((v, key) => resp.push(fn(v, key)));
    return resp;
  }

  get label() {
    let active = this.active;
    return active.length == 0 ? 'None' : active.map(sort => sort.label).join(', ');
  }

  get active() {
    let active = [];
    Object.keys(this.value).forEach(key => {
      if (this.get(key)) active.push(this.get(key));
    });
    return active;
  }

  async showMenu(el) {
    let oldVal = this.value;
    let menu = this.map(sort => {
      return {
        label: sort.label,
        val: sort.key,
        description: sort.description,
        desc: sort.isDesc,
        extras: ['b-list-sort-dir-btn']
      };
    });
    menu.push({
      text: _litElement.html`Sorts will be applied in the order they are chosen.`
    });
    let selected = await new _menu.default(menu, {
      className: 'b-list-sort-menu',
      multiple: true,
      selected: Object.keys(oldVal)
    }).popover(el);
    if (selected === false) return; // reformat selected values to what we need

    let val = {};
    selected.forEach(s => val[s.val] = {
      desc: s.desc
    });
    this.value = val;
  }

  sort(data) {
    // return
    let sorts = this.active;
    return new Promise(resolve => {
      if (sorts.length == 0) return resolve(data);
      data.sort(function (m1, m2) {
        for (let sort of sorts) {
          let val = sort.sortCompare(m1, m2); // the sort compare found different values

          if (val !== false) return val;
        }
      });
      resolve(data);
    });
  }

}

exports.default = Sorts;
(0, _componentEmitter.default)(Sorts.prototype);

class Sort {
  constructor(key, attrs) {
    this.key = key;
    if (typeof attrs == 'function') attrs = {
      sortBy: attrs
    };
    this.attrs = attrs;
  }

  get sortBy() {
    return this.attrs.sortBy || (m => m.get(this.key));
  }

  get label() {
    return this.attrs.label || (0, _titleize.default)(this.key);
  }

  get description() {
    return this.attrs.description || null;
  }

  get isDesc() {
    return this.selected ? this.selected.desc : this.attrs.desc || false;
  }

  sortCompare(m1, m2) {
    let v1 = this.sortBy(m1);
    let v2 = this.sortBy(m2);
    if (v1 > v2) return this.isDesc ? -1 : 1;
    if (v1 < v2) return this.isDesc ? 1 : -1;
    return false;
  }

}
},{"lit-element":"+bhx","../../menu":"0tCY","../../../util/titleize":"NUHt","component-emitter":"Wr69"}],"FOqU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

customElements.define('b-list-sort-btn', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: block
        }

        main {
            display: inline-grid;
            line-height: 1.2em;
        }

        b-label {
            grid-area: unset !important;
        }

        .none:not(:first-child) {
            display: none;
        }

        b-icon {
            font-size: .8em;
            vertical-align: baseline;
            color: rgba(0,0,0,.4);
        }

        /* b-icon:hover {
            cursor: pointer;
            color: var(--primaryColor)
        } */
    `;
  }

  render() {
    return _litElement.html`
        <b-btn text class="sorts" @click=${this.sortMenu}>
            <main>
                <b-label xs>Sort</b-label>

                <div>
                    ${this.sorts.active.map(sort => _litElement.html`
                        <span .sort=${sort}>
                            <b-icon name="${sort.isDesc ? 'sort-alt-down' : 'sort-alt-up'}"></b-icon> ${sort.label}
                        </span>
                    `)}
                    <span class="none">None</span>
                </div>
            </main>
        </b-btn>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.update = this.update.bind(this);
    this.sorts.on('change', this.update);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.sorts.off('change', this.update);
  } // changeDir(e){
  //     e.stopPropagation()
  //     let sort = e.currentTarget.parentElement.sort
  // }


  sortMenu(e) {
    this.sorts.showMenu(e.currentTarget);
  }

});

var _default = customElements.get('b-list-sort-btn');

exports.default = _default;
},{"lit-element":"+bhx"}],"pUXj":[function(require,module,exports) {
"use strict";

var _litElement = require("lit-element");

customElements.define('b-list-sort-dir-btn', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: block
        }

        b-btn {
            margin-top: -.5em;
            margin-bottom: -.5em;
            margin-right: -.5em;
        }

        b-btn:hover {
            --bgdColor: none !important;
            --textColor: var(--primaryColor)
        }
    `;
  }

  firstUpdated() {
    this.classList.add('when-active');
  }

  render() {
    return _litElement.html`
        <b-btn clear icon="${this.item.desc ? 'sort-alt-down' : 'sort-alt-up'}" @click=${this.onClick}></b-btn>
    `;
  }

  onClick(e) {
    e.stopPropagation();
    this.item.desc = !this.item.desc;
    this.update();
  }

});
},{"lit-element":"+bhx"}],"7zIY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

customElements.define('b-list-filter-btn', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: inline-block;
        }

        b-btn {
            --color: var(--toolbarTextColor);
        }

        main {
            display: inline-grid;
            line-height: 1.2em;
        }

        b-label {
            grid-area: unset;
            color: var(--toolbarTextColor);
            /* opacity: .4; */
        }

        b-icon {
            font-size: .8em;
            vertical-align: baseline;
            color: var(--toolbarTextColor);
            opacity: .4;
        }

        b-btn:not([active]) {
            color: var(--toolbarTextColor);
            opacity: .4;
        }

        b-btn[active] {
            font-weight: bold;
        }
    `;
  }

  render() {
    return _litElement.html`
        <b-btn text ?active=${this.filter.isActive} @click=${this.showMenu}>
            <main>
                <b-label xs>${this.filter.label}</b-label>
                <div>
                    ${this.filter.icon ? _litElement.html`<b-icon name="${this.filter.icon}"></b-icon>` : ''}
                    ${this.filter.valueLabel}
                </div>
            </main>
        </b-btn>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.update = this.update.bind(this);
    this.filter.on('change', this.update); // this.addEventListener('filter-changed', this.update, true)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.filter.off('change', this.update); // this.removeEventListener('filter-changed', this.update, true)
  }

  showMenu(e) {
    this.filter.showMenu(e.currentTarget);
  }

});

var _default = customElements.get('b-list-filter-btn');

exports.default = _default;
},{"lit-element":"+bhx"}],"uCjH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

require("../../form-control/form-control");

require("../../form-control/controls/text-field");

customElements.define('b-list-search-bar', class extends _litElement.LitElement {
  static get properties() {
    return {
      placeholder: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.placeholder = 'Search';
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: block
        }

        form-control {
            padding: .5em .65em;
            background: var(--searchBgd);
            border-radius: 30px;
            /* max-width: 140px; */
        }

        text-field {
            min-width: 70px;
            /* transition: 300ms; */
        }

        form-control[falsy]:not(:focus-within):not(:hover){
            background: none;
        }

        form-control[falsy]:not(:focus-within){
            cursor: pointer;
        }

        form-control[falsy]:not(:focus-within) text-field {
            height: 1em;
            overflow: hidden;
            min-width: 0;
            width: 0;
            margin-right: -.5em;
        }

        b-icon {
            color: #444;
            margin-right: .5em;
        }
    `;
  }

  render() {
    return _litElement.html`
        <form-control>
            <text-field placeholder="${this.placeholder}" bubble-keypress single-line></text-field>
            <b-icon @click=${this.focus} name="search" slot="prefix"></b-icon>
        </form-control>
    `;
  }

  focus() {
    this.shadowRoot.querySelector('form-control').focus();
  }

  get value() {
    this.textField = this.textField || this.shadowRoot.querySelector('text-field');
    return this.textField.currentValue;
  }

});

var _default = customElements.get('b-list-search-bar');

exports.default = _default;
},{"lit-element":"+bhx","../../form-control/form-control":"swB1","../../form-control/controls/text-field":"2ezN"}],"iwaU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _popover = _interopRequireDefault(require("../../popover"));

require("./sort-btn");

require("./sort-dir-btn");

require("./filter-btn");

require("./search");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('b-list-toolbar', class extends _litElement.LitElement {
  static get properties() {
    return {
      count: {
        type: Number
      },
      queuing: {
        type: Number
      }
    };
  }

  constructor() {
    super();
    this.count = 0;
    this.onFilterQueuing = this.onFilterQueuing.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: flex;
            align-items: center;
            min-width: 0;
        }

        [hidden] { display: none; }

        b-list-sort-btn {
            flex-shrink: 0;
        }

        .filters {
            display: flex;
            align-items: center;
            overflow-y: auto;
            overflow: -moz-scrollbars-none;
            flex: 1;
        }

        .filters::-webkit-scrollbar { width: 0 !important; height: 0 !important; }

        b-list-sort-btn + .filters {
            border-left: solid 2px rgba(0,0,0,.1);
            margin-left: .25em;
            padding-left: .25em;
        }

        .after {
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        .count {
            align-self: stretch;
            display: flex;
            align-items: center;
            border-right: 2px solid rgba(0, 0, 0, 0.1);
            padding: 0 .75em 0 .25em;
            margin-right: .25em;
        }

        [icon='erase'] { display: none; }
        b-list-filter-btn[active] ~ [icon="erase"] {
            display: inline-block
        }

        b-list-filter-btn {
            flex-shrink: 0;
        }

        .controls {
            display: inline-grid;
        }

        .controls > b-icon {
            font-size: .8em;
            padding: .2em .35em;
            color: rgba(0, 0, 0, 0.4);
        }

        .controls > b-icon:hover {
            color: #333;
        }
    `;
  }

  render() {
    return _litElement.html`
        <slot name="before"></slot>

        <div class="count">${this.count}</div>

        ${!this.sorts ? '' : _litElement.html`
            <b-list-sort-btn .sorts=${this.sorts}></b-list-sort-btn>
        `}
        
        ${!this.filters ? '' : _litElement.html`
        <div class="filters">

            <!-- <div class="controls">
                <b-icon name="layers" text></b-icon>
                <b-icon name="erase" text></b-icon>
            </div> -->

            <b-btn icon="layers" ?hidden=${!this.queuing} title="Apply queued filters" text
                @click=${this.applyQueuedFilters}>${this.queuing}</b-btn>
            
            ${this.filters.map(filter => _litElement.html`
                <b-list-filter-btn ?active=${filter.isActive} .filter=${filter}></b-list-filter-btn>
            `)}
            
            <b-btn color="hover-red" title="Clear filters" icon="erase" text @click=${this.resetFilters}></b-btn>
            
        </div>
        `}
        
        <div class="after">

            ${!this.filters || !this.filters.showSearch ? '' : _litElement.html`
            <b-list-search-bar @keydown=${this.onKeyDown} placeholder=${this.filters.searchOptions.placeholder}></b-list-search-bar>
            `}

            <slot name="refresh-btn"></slot>

            <slot name="after"></slot>
        </div>
    `;
  }

  applyQueuedFilters() {
    this.filters.queuing = false;
  }

  resetFilters() {
    this.filters.reset();
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.filters) {
      this.filters.on('queuing', this.onFilterQueuing);
      this.filters.on('change', this.onFilterChange);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.filters) {
      this.filters.off('queuing', this.onFilterQueuing);
      this.filters.off('change', this.onFilterChange);
    }
  }

  onFilterQueuing(length) {
    this.queuing = length;
  }

  onFilterChange() {
    this.update();
  } // not used, testing idea


  openOver(el, opts) {
    new _popover.default(el, this, opts);
  }

  onKeyDown(e) {
    let target = e.target;
    let ts = this.filters.searchOptions.delay;
    clearTimeout(this._keydownTimeout);
    this._keydownTimeout = setTimeout(_ => {
      let term = target.value;
      if (term == this.filters.term) return;
      this.filters.term = term;
      this.dispatchEvent(new CustomEvent('filter-term-changed', {
        bubbles: true,
        composed: true,
        detail: {
          term: term
        }
      }));
    }, ts);
  }

});

var _default = customElements.get('b-list-toolbar');

exports.default = _default;
},{"lit-element":"+bhx","../../popover":"Soyf","./sort-btn":"FOqU","./sort-dir-btn":"pUXj","./filter-btn":"7zIY","./search":"uCjH"}],"2zwr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

require("../../elements/empty-state");

customElements.define('b-infinite-list', class extends HTMLElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: block
        }
    `;
  }

  constructor() {
    super();
    this.pageAt = 0;
    this.threshold = 400;
  }

  connectedCallback() {
    this.addEventListener('scroll', this.onScroll, true);
    this.getContent();
  }

  disconnectedCallback() {
    this.removeEventListener('scroll', this.onScroll, true);
  }

  async reset() {
    this.pageAt = 0;
    this.scrollTop = 0;
    this.prevModel = null;
    this.innerHTML = '';
    await this.getContent();
  }

  onScroll() {
    let delta = this.scrollHeight - this.scrollTop - this.offsetHeight;
    let down = !this._scrollDelta || delta < this._scrollDelta;
    this._scrollDelta = delta;
    if (!down || delta == 0) return;
    if (delta <= this.threshold) this.getContent();
  }

  async getContent() {
    if (!this.dataSource) return;
    if (this._fetching) return;
    let pageAt = this.pageAt;
    this._fetching = await this.dataSource.fetch(pageAt).then(this.addContent.bind(this));
    this._fetching = null;

    if (pageAt == 0) {
      this.dispatchEvent(new CustomEvent('content-changed', {
        detail: {
          data: this.dataSource
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  get rowElement() {
    return this.getAttribute('row') || 'div';
  }

  get emptyElement() {
    return this.getAttribute('empty') || 'b-empty-state';
  }

  addContent(models) {
    this.pageAt += models.length;

    if (this.pageAt == 0) {
      this.emptyView = this.emptyView || document.createElement(this.emptyElement);
      this.emptyView.dataSource = this.dataSource;
      let term = this.dataSource.filters && this.dataSource.filters.term;
      this.emptyView.value = term ? `No results for “${term}”` : this.getAttribute('placeholder') || 'No results';
      this.appendChild(this.emptyView);
      return;
    }

    models.forEach(model => {
      let divider = this.divider && this.divider(this.prevModel, model);

      if (divider) {
        this.appendChild(divider);
      }

      let el = document.createElement(this.rowElement);
      el.model = model;
      this.appendChild(el);
      this.prevModel = model;
    });
  }

});

var _default = customElements.get('b-infinite-list');

exports.default = _default;
},{"lit-element":"+bhx","../../elements/empty-state":"+2dU"}],"tkaB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litElement = require("lit-element");

var _source = _interopRequireDefault(require("./data/source"));

var _filters = _interopRequireDefault(require("./data/filters"));

var _sorts = _interopRequireDefault(require("./data/sorts"));

require("./toolbar");

require("./infinite-list");

require("../../elements/spinner-overlay");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('b-list', class extends _litElement.LitElement {
  constructor() {
    super();
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.divider = this.divider.bind(this);
  }

  get coll() {
    return this.__coll;
  }

  set coll(coll) {
    let didChange = !!this.__coll && this.__coll != coll;
    this.__coll = coll;
    this.dataSource.coll = coll;
    if (didChange) this.refresh(); // I think this is ok to do here
  }

  set key(key) {
    this.__key = key;
  }

  get key() {
    return this.__key || this.getAttribute('key');
  }

  get filters() {
    if (!this.__filters) this.filters = {};
    return this.__filters;
  }

  set filters(filters) {
    if (!this.__filters) {
      this.__filters = new _filters.default();
      this.filters.key = this.key;
      this.filters.list = this;
      this.dataSource.filters = this.filters;
      this.filters.on('change', this.onFilterChange.bind(this));
    }

    this.filters.use(filters);
  }

  get sorts() {
    return this.__sorts;
  }

  set sorts(sorts) {
    if (!this.__sorts) {
      this.__sorts = new _sorts.default();
      this.sorts.key = this.key;
      this.sorts.list = this;
      this.dataSource.sorts = this.sorts;
      this.sorts.on('change', this.onSortChange.bind(this));
    }

    this.sorts.use(sorts);
  }

  get dataSource() {
    if (!this.__dataSource) {
      this.__dataSource = new _source.default(this.listOptions);

      this.__dataSource.on('change:count', count => {
        this.toolbar.count = count;
      });
    }

    return this.__dataSource;
  }

  static get styles() {
    return _litElement.css`
        :host {
            display: grid;
            grid-template-rows: auto auto 1fr;
            overflow: hidden;
            flex: 1;
            position: relative;
            --searchBgd: #f5f5f5;
        }

        slot[name="header"] {
            display: block;
        }

        b-spinner-overlay {
            --spinnerBgd: rgba(255,255,255,.5);
            --spinnerSize: 6em;
        }

        b-list-toolbar {
            box-shadow: rgba(0,0,0,.2) 0 0 6px;
            padding: .25em .5em;
            z-index: 10;
        }

        b-infinite-list {
            display: block;
            flex: 1;
            overflow: auto;
            position: relative;
        }

        b-infinite-list > [selected] {
            position: relative;
        }

        b-infinite-list > [selected]:before {
            position: absolute;
            content: '';
            border: solid 1.4em #E3F2FD;
            border-left-width: 2em;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
        }

        contract-draft-row { /* FIXME: remove? */
            padding: 2em;
        }

        contract-draft-row:not(:last-child) {
            border-bottom: solid 1px rgba(0,0,0,.1);
        }

        /* .queuing-overlay {
            display: none;
            background: rgba(255,255,255,.8);
            color: #888;
            z-index: 1000;
        }

        :host([queuing]) .queuing-overlay {
            display: flex;
        } */
    `;
  }

  get spinner() {
    return this.__spinner = this.__spinner || this.querySelector('[slot="spinner"]') || this.shadowRoot.querySelector('b-spinner-overlay');
  }

  render() {
    return _litElement.html`
        <slot name="spinner">
            <b-spinner-overlay></b-spinner-overlay>
        </slot>
        
        <b-list-toolbar .filters=${this.filters} .sorts=${this.sorts} 
            @filter-term-changed=${this.onFilterTermChange}>
            <slot name="toolbar:before" slot="before"></slot>
            <slot name="toolbar:after" slot="after"></slot>
            <slot name="toolbar:refresh" slot="refresh-btn">
                <b-btn text pill icon="arrows-ccw" @click=${this.refresh}></b-btn>
            </slot>
            <!-- <b-label slot="after" class="queuing-label">Queuing filters, release to apply</b-label> -->
        </b-list-toolbar>
        <slot name="header"></slot>
        <b-infinite-list
            row="${this.rowElement}"
            empty="${this.emptyElement}"
            .divider=${this.divider}
            .dataSource=${this.dataSource}
        ></b-infinite-list>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.onKeydown, true);
    window.addEventListener('keyup', this.onKeyup, true);
    let host = this.getRootNode().host;

    if (host) {
      this.host = host;
      host.list = host.list || this;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.onKeydown, true);
    window.removeEventListener('keyup', this.onKeyup, true);
    if (this.host && this.host.list == this) delete this.host;
  }

  onKeydown(e) {
    if (e.target !== document.body) return;
    if (!e.metaKey && !e.ctrlKey) return;
    this.queuing = true;
  }

  onKeyup(e) {
    if (this.queuing && !this.filters.queuedChanges) this.queuing = false;
  }

  get queuing() {
    return this.filters && this.filters.queuing;
  }

  set queuing(doQueue) {
    if (!this.filters) return;
    this.filters.queuing = doQueue;
    doQueue ? this.setAttribute('queuing', '') : this.removeAttribute('queuing');
  }

  get rowElement() {
    return this.getAttribute('row') || '';
  }

  get emptyElement() {
    return this.getAttribute('empty') || '';
  }

  get toolbar() {
    return this.shadowRoot.querySelector('b-list-toolbar');
  }

  get list() {
    return this.shadowRoot.querySelector('b-infinite-list');
  }

  divider(prevModel, model) {
    let divider = this.getAttribute('divider');
    divider = divider && customElements.get(divider);

    if (divider && divider.shouldDisplay && divider.shouldDisplay(prevModel, model, this)) {
      divider = new divider(prevModel, model, this);
      divider.list = this;
      divider.model = model;
      divider.prevModel = prevModel;
      return divider;
    }

    return null;
  }

  async firstUpdated() {
    this.spinner.show = true;
    this.toolbar.count = await this.dataSource.length();
    this.spinner.show = false;
  }

  async refresh() {
    this.spinner.show = true;
    this.dataSource.reset();
    this.list.reset();
    this.toolbar.count = await this.dataSource.length();
    this.spinner.show = false;
  }

  async reload() {
    this.dataSource.refilter();
    this.list.reset();
    this.toolbar.count = await this.dataSource.length();
  }

  async onFilterTermChange(changes) {
    // TODO: probably need an opt in feature
    if (this.listOptions && this.listOptions.fetch == 'more') {
      this.dataSource.reset();
    }

    this.dataSource.applyFilters();
    this.list.reset();
    this.toolbar.count = await this.dataSource.length();
  }

  async onFilterChange(changes) {
    if (this.filters.needsDatabaseFetch(changes)) {
      this.spinner.show = true;
      this.dataSource.reset();
    }

    this.dataSource.applyFilters();
    this.list.reset();
    this.toolbar.count = await this.dataSource.length();
    this.spinner.show = false;
  }

  onSortChange() {
    // console.log('resort');
    this.dataSource.sort();
    this.list.reset();
  }

});

var _default = customElements.get('b-list');

exports.default = _default;
},{"lit-element":"+bhx","./data/source":"zXhY","./data/filters":"HGW8","./data/sorts":"4sAK","./toolbar":"iwaU","./infinite-list":"2zwr","../../elements/spinner-overlay":"eyVY"}],"TMO9":[function(require,module,exports) {
"use strict";

var _litElement = require("lit-element");

customElements.define('b-list-of-colors', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: grid;
            --grids: 1fr 1fr 1fr 1fr;
            grid-template-columns: var(--grids);
            gap: 1em;
        }

        [group="default"] {
            grid-column: 1/5;
        }

        [group="default"] .colors {
            display: grid;
            grid-template-columns: var(--grids);
            gap: 1em;
        }

        .color {
            border: 1px solid rgba(0,0,0,.12);
            padding: .5em;
            /* display: flex;
            justify-content: space-between;
            align-items: center; */
        }

        [num="900"] + [num] {
            margin-top: .5em;
        }

        @media (max-width: 550px) {
            :host {
                --grids: 1fr 1fr;
            }

            [group="default"] {
                grid-column: 1/3
            }
        }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.colors = [];

    for (let sheet of document.styleSheets) {
      let rules = null;

      try {
        rules = sheet.cssRules;
      } catch (e) {}

      if (rules) for (let rule of rules) {
        if (rule.cssText.match(/:root { --color/)) {
          let matches = rule.cssText.match(/--.[^:)]+: (.[^;]+);/g);
          let colors = {};
          matches.map(v => {
            let [str, name, num, color] = v.match(/--(.[^\d(A\d)]+)(?:-(.+))?: (.[^;]+);/);
            let key = name + (num ? '-' + num : '');

            if (num) {
              colors[name] = colors[name] || {
                name: name,
                colors: []
              };
              colors[name].colors.push({
                key,
                name,
                num,
                color
              });
            } else {
              colors['default'] = colors['default'] || {
                name: 'default',
                colors: []
              };
              colors['default'].colors.push({
                key,
                name,
                num,
                color
              });
            }
          });
          this.colors = Object.values(colors);
        }
      }
    }
  }

  render() {
    return _litElement.html`
        ${this.colors.map(g => _litElement.html`
            <div group="${g.name}">
                <h3>${g.name}</h3>
                <div class="colors">
                ${g.colors.map(c => _litElement.html`
                    <div num=${c.num} key="${c.key}" class="color" style="background-color: var(--${c.key});">
                        <div>${c.key}</div>
                        <!-- <b-sub>${c.num ? c.color : ''}</b-sub> -->
                    </div>
                `)}
                </div>
            </div>
        `)}
    `;
  }

});
},{"lit-element":"+bhx"}],"lgAh":[function(require,module,exports) {
"use strict";

require("../elements/icon");

require("../elements/btn");

require("../elements/spinner");

require("../elements/spinner-overlay");

require("../elements/uploader");

require("../elements/paper");

require("../elements/timer");

require("../elements/empty-state");

require("../elements/label");

require("../elements/avatar");

require("../elements/hr");

require("../elements/sub");

require("../elements/embed");

require("../elements/audio");

require("../elements/carousel");

var _litElement = require("lit-element");

var _router = _interopRequireDefault(require("../router"));

require("../presenters/tabs");

require("../presenters/form-control");

require("../presenters/list");

var _panel = _interopRequireWildcard(require("../presenters/panel"));

var _menu = _interopRequireDefault(require("../presenters/menu"));

var _dialog = _interopRequireDefault(require("../presenters/dialog"));

var _README = _interopRequireDefault(require("../util/README.md"));

require("../helpers/colors.less");

require("../helpers/colors-list");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Dialog = _dialog.default;

window.showMenu = async function (el, renderTo = false) {
  let menu = [{
    divider: 'Group Title'
  }, {
    label: 'Menu Item 1',
    val: '1'
  }, {
    label: 'Menu Item 2',
    val: '2'
  }, {
    label: 'Menu Item 3',
    val: '3'
  }, 'divider', {
    label: 'More',
    menu: [{
      label: 'Submenu 1',
      val: 'more-1'
    }, {
      label: 'Submenu 2',
      val: 'more-2'
    }],
    menuOpts: {
      popover: {
        align: 'right-start'
      }
    }
  }, {
    text: 'Look at the console after selecting a value'
  }];
  menu = new _menu.default(menu);

  if (renderTo) {
    el.appendChild(menu.el);
    menu.render();
  } else {
    let selected = await menu.popover(el);
  }
};

showMenu(document.querySelector('#render-menu'), true);

_panel.default.register('view-1', () => _litElement.html`
    <b-panel-toolbar shadow>
        <b-btn slot="right">Right Side</b-btn>
        <span slot="left">
            <b-hr vert></b-hr>
            Left Content
        </span>
        <span slot="middle"> <b-label filled>Badge</b-label></span>
    </b-panel-toolbar>
    <main style="flex:1">
        <b-tabs layout="left">
            <div title="View 1">Try using your browser's back button</div>
            <div title="View 2">View 2 content</div>
        </b-tabs>
    </main>
`, {
  title: 'View 1'
});

customElements.define('view-two', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        main {
            padding: 1em;
            overflow: auto;
        }
    `;
  }

  render() {
    return _litElement.html`
        <b-panel-toolbar look="white" noshadow>
            <b-btn slot="right" @click=${this.btnMenu}>Change Style</b-btn>
        </b-panel-toolbar>
        <main>
            content
        </main>
    `;
  }

  async btnMenu(e) {
    let selected = await new _menu.default([{
      label: 'Modal',
      opts: {
        width: '600px',
        height: '400px',
        anchor: 'center'
      }
    }, {
      label: 'Drawer',
      opts: {
        width: '600px',
        height: '',
        anchor: 'right'
      }
    }, {
      label: 'Drawer Left ',
      opts: {
        width: '600px',
        height: '',
        anchor: 'left'
      }
    }, {
      label: 'Slide Top ',
      opts: {
        width: '100%',
        height: '50vh',
        anchor: 'top'
      }
    }, 'divider', {
      label: 'Reset',
      icon: 'arrows-ccw',
      opts: {
        width: '100%',
        height: '100%',
        anchor: 'right'
      }
    }]).popover(e.target, {
      align: 'bottom-end'
    });

    if (selected) {
      console.log(selected);

      for (let key in selected.opts) {
        console.log(key);
        this.panel[key] = selected.opts[key];
      }
    }
  }

});

_panel.default.register('view-2', 'view-two', {
  title: 'View 2'
});

_panel.default.register('view-2-small', 'view-two', {
  title: 'View 2 Small',
  width: '600px',
  height: '400px',
  anchor: 'center'
});

customElements.define('view-animate', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        main {
            padding: 1em;
            overflow: auto;
        }
    `;
  }

  render() {
    return _litElement.html`
        <b-panel-toolbar look="white" noshadow></b-panel-toolbar>
        <main>
            <b-btn @click=${this.animate}>bounce</b-btn>
            <b-btn @click=${this.animate}>shake</b-btn>
        </main>
    `;
  }

  animate(e) {
    let fn = e.target.innerText;
    this.panel[fn]();
  }

});

_panel.default.register('view-animate', 'view-animate', {
  title: 'View Animate',
  width: '600px',
  height: '400px',
  anchor: 'center'
});

_panel.default.register('view-3', 'view-two', {
  title: 'View 3',
  controller: 'inset',
  width: '400px',
  anchor: 'right'
});

window.openModalPanel = () => {
  (0, _panel.Modal)(() => _litElement.html`
        <b-embed url="https://www.youtube.com/watch?v=sK1ODp0nDbM"></b-embed>
    `, {
    closeBtn: true,
    width: '60vw'
  });
};

let listData = [];
let i = 0;

while (i++ < 100) {
  listData.push({
    id: i,
    label: 'Row ' + i,
    date: new Date().getTime() + i * 10000000
  });
}

const listSorts = {
  id: {
    label: 'ID',

    sortBy(m) {
      return m.id;
    }

  }
};
customElements.define('a-list-view', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: block;
            height: 340px;
            /* margin: -2em; */
            border-bottom: solid 1px rgba(0,0,0,.1);
        }

        b-list {
            height: 100%;
            overflow: hidden;
        }
    `;
  }

  render() {
    return _litElement.html`
        <b-list
            key="a-list-view"
            row="a-list-view-row"
            .sorts=${listSorts}
            .coll=${listData}
        ></b-list>
    `;
  }

});
customElements.define('a-list-view-row', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: block;
            padding: .5em 1em;
        }
    `;
  }

  render() {
    return _litElement.html`
        ${this.model.label}
    `;
  }

});
customElements.define('tab-divider', class extends _litElement.LitElement {
  static get styles() {
    return _litElement.css`
        :host {
            display: block;
            color: inherit;
            margin: 1em 0 0 0;
            padding: 1em 1.2em .5em;
            border-top: solid 1px rgba(0,0,0,.1);
        }
    `;
  }

  render() {
    return _litElement.html`
        <b-label><slot></slot></b-label>
    `;
  }

});
customElements.define('b-util-info', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = _README.default;
  }

}); // import formControlDocs from '../presenters/form-control/README.md'
// document.querySelector('#form-control-docs').innerHTML = formControlDocs
// import listDocs from '../presenters/list/README.md'
// document.querySelector('#list-docs').innerHTML = listDocs

window.dialogs = {
  async success(el) {
    _dialog.default.success().modal();
  },

  async warn(el) {
    _dialog.default.warn({
      title: 'Ooops',
      msg: 'That is not supported'
    }).modal();
  },

  async error(el) {
    _dialog.default.error({
      title: 'Error',
      msg: 'Something went wrong'
    }).modal();
  },

  async errorPopover(el) {
    _dialog.default.error({
      title: 'Error',
      msg: 'Something went wrong'
    }).popover(el);
  },

  async confirm(el) {
    if (await _dialog.default.confirm().modal()) console.log('confimed');
  },

  async confirmDelete(el) {
    if (await _dialog.default.confirmDelete().popover(el)) console.log('confimed delete');
  }

};
document.querySelector('#dialog-success').appendChild(_dialog.default.success().el);
document.querySelector('#dialog-warn').appendChild(_dialog.default.warn({
  title: 'Ooops',
  msg: 'That is not supported'
}).el);
document.querySelector('#dialog-error').appendChild(_dialog.default.error({
  title: 'Error',
  msg: 'Something went wrong'
}).el);

window.openView = el => {
  event.preventDefault();

  _router.default.goTo(el.getAttribute('href'));
};

_router.default.start();
},{"../elements/icon":"ncPe","../elements/btn":"DABr","../elements/spinner":"EnCN","../elements/spinner-overlay":"eyVY","../elements/uploader":"aYTp","../elements/paper":"Yy3A","../elements/timer":"u+eY","../elements/empty-state":"+2dU","../elements/label":"DcCw","../elements/avatar":"Da++","../elements/hr":"IOAQ","../elements/sub":"VANQ","../elements/embed":"bpDM","../elements/audio":"EIVk","../elements/carousel":"inC5","lit-element":"+bhx","../router":"38Qe","../presenters/tabs":"BsQP","../presenters/form-control":"wbVn","../presenters/list":"tkaB","../presenters/panel":"cmZt","../presenters/menu":"0tCY","../presenters/dialog":"pos3","../util/README.md":"H6j2","../helpers/colors.less":"r4vn","../helpers/colors-list":"TMO9"}],"RVcF":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"m0oQ":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"RVcF"}],"uu9t":[function(require,module,exports) {
module.exports = function loadHTMLBundle(bundle) {
  return fetch(bundle).then(function (res) {
    return res.text();
  });
};
},{}],0:[function(require,module,exports) {
var b=require("m0oQ");b.register("html",require("uu9t"));b.load([["icons.svg.c6868b42.html","pxeq"],["README.2b4753d8.html","H6j2"]]).then(function(){require("lgAh");});
},{}]},{},[0], null)
//# sourceMappingURL=demo.056cadd9.js.map