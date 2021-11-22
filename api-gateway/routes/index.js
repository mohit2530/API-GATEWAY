
const axios = require('axios'),
    express = require('express'),
    fs = require('fs'),
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
 * Register Method to register all the routes while the application starts.
 * This data can be retrieved from a database as well, but here we are writing
 * this to a file.
 */
router.post('/register', (req, res) => {

    const apiInfo = req.body;
    registry.services[apiInfo.apiName] = { ...apiInfo };

    // write to the file
    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
        if (error) res.send("Registration failed in registry : " + apiInfo.apiName + "\n" + error)
        res.send("Registration Completed of : " + apiInfo.apiName);
    })

})

/**
 * Router method to intercept all incomming requests.
 * If derieved address is non-existent, gateway errors out.
 */
router.all('/:requestUri', (req, res) => {

    const forwardAddress = req.params.requestUri,
        derievedAddress = buildUri(forwardAddress);

    if (!derievedAddress)
        res.status(503)
            .send("Invalid Gateway Reference.")

    // all crud operations friendly
    axios({
        method: req.method,
        url: derievedAddress,
        headers: req.headers,
        data: req.body
    })
        .then((element) => {
            res.send(element.data)
        })
        .catch(err => {
            res.status(500)
                .send("Internal Server Error.")
        });

})


module.exports = router