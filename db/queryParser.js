var url = require('url');
var querystring = require('querystring');
var parser = require('odata-parser');
var queryTransform = require('./queryTransform');
/**
 *  filter operator: https://learn.microsoft.com/en-us/dynamics-nav/using-filter-expressions-in-odata-uris
 */
module.exports = function (req) {
    var queryOptions = {
        $filter: {}
    };
    var _url = url.parse(req.url, true);
    if (_url.search) {
        var query = _url.query
        var fixedQS = {};
        if (query.$) fixedQS.$ = query.$;
        if (query.$expand) fixedQS.$expand = query.$expand;
        if (query.$filter) fixedQS.$filter = query.$filter;
        if (query.$format) fixedQS.$format = query.$format;
        if (query.$inlinecount) fixedQS.$inlinecount = query.$inlinecount;
        if (query.$select) fixedQS.$select = query.$select;
        if (query.$skip) fixedQS.$skip = query.$skip;
        if (query.$top) fixedQS.$top = query.$top;
        if (query.$orderby) fixedQS.$orderby = query.$orderby;

        var encodedQS = decodeURIComponent(querystring.stringify(fixedQS));
        if (encodedQS) {
            var parseresult = parser.parse(encodedQS);
            queryOptions = queryTransform(parseresult);
        }
        if (query.$count) {
            queryOptions.$inlinecount = true;
        }
    }
    if (req.params.$count) {
        queryOptions.$count = true
    }

    return queryOptions;
}