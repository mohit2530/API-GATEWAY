
const axios = require('axios'),
    express = require('express'),
    registry = require('./registry.json');

const router = express.Router();

/**
 * method to build the uri base path
 * @returns a single state of uri with svcProps
 */
function buildUri(apiPath) {

    const pathParams = registry.services[apiPath];
    switch (apiPath) {
        case "testApi":
            return pathParams.host + pathParams.portEnv + pathParams.apiName;

        case "recordsApi":
            return pathParams.host + pathParams.portEnv + pathParams.apiName;

        default:
            return null;
    }
}

/**
 * forward all request
 */
router.all('/:requestUri', (req, res) => {

    const forwardAddress = req.params.requestUri,
        derievedAddress = buildUri(forwardAddress);

    if (!derievedAddress) {
        res.status(503)
            .send("Invalid Gateway Reference.")
    }

    axios.get(derievedAddress)
        .then((element) => {
            res.send(element.data)
        })
        .catch(err => {
            console.log(err)
        });

})



module.exports = router