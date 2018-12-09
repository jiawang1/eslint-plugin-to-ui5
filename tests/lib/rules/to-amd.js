/**
 * @fileoverview use AMD style API to load modules
 * @author Jay
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/to-amd"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("to-amd", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        // {
        //     code: "let test = $.sap.require",
        //     parserOptions: { ecmaVersion: 6 },
        //     errors: [{
        //         messageId: "require"
        //     }]
        // },
        // {
        //     code: "$.sap.declare()",
        //     errors: [{
        //         messageId: "declare"
        //     }]
        // }
    ]
});
