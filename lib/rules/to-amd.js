/**
 * @fileoverview use AMD style API to load modules
 * @author Jay
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const methods = ["require", "declare", "includeStyleSheet", "includeScript"];

module.exports = {
  meta: {
    docs: {
      description: "use AMD style API to load modules",
      // category: 'Deprecated',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
    messages: {
      ...methods.reduce((obj, key) => {
        obj[key] = `method $.sap.${key} is deprecated`;
        return obj;
      }, {})
      // require: 'method $.sap.require is deprecated, use sap.ui.require instead',
      // declare: 'method $.sap.require is deprecated, use defined and $.sap.setObject instead',
      // includeStyleSheet: 'method $.sap.includeStyleSheet is deprecated',
      // includeScript: 'method $.sap.includeScript is deprecated'
    }
  },

  create: function(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    let jqueryName = null;

    const constructSelector = obj => {
      return methods.reduce((pre, key) => {
        pre[`MemberExpression>Identifier[name='${key}']`] = node => {
          if (node.parent && node.parent.object) {
            const caller = node.parent.object;
            if (caller.property && caller.property.name === "sap") {
              if (caller.object) {
                if (
                  caller.object.name === "$" ||
                  caller.object.name.tolowerCase() === "jquery" ||
                  (jqueryName !== null && caller.object.name === jqueryName)
                ) {
                  context.report({
                    node,
                    messageId: node.name
                  });
                }
              }
            }
          }
        };
        return pre;
      }, obj);
    };

    const ret = {
      Program: function(node) {
        if (node.body[0].type === "ExpressionStatement") {
          const exp = node.body[0].expression;
          if (!exp.arguments) {
            return;
          }
          const deps = exp.arguments.find(
            arg => arg.type === "ArrayExpression"
          );
          const factory = exp.arguments.find(
            arg =>
              arg.type === "FunctionExpression" ||
              arg.type === "ArrowFunctionExpression"
          );
          let jqueryIndex = -1;
          if (deps && deps.elements) {
            jqueryIndex = deps.elements.findIndex(
              ele => ele.value.toLowerCase() === "jquery.sap.global"
            );
          }
          if (jqueryIndex < 0) {
            return;
          }
          if (factory && factory.params) {
            jqueryName = factory.params[jqueryIndex].name;
          }
        }
      }
    };
    const obj = constructSelector(ret);

    return obj;
  }
};
