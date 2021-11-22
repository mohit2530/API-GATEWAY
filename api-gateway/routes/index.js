
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
    return pathParams.host + pathParams.portEnv + pathParams.apiName;

}

/**
 * method to verify if the api exists in the registry.json file
 *
 * @param {*} apiInfo is information about the api
 * @returns boolean true / false
 */
function apiExists(apiInfo) {

    console.log(apiInfo.apiName);
    registry.services[apiInfo.apiName].forEach(element => {
        if (element.apiName === apiInfo.apiName) {
            return true
        }
    });
    return false

}

/**
 * Register Method to register all the routes while the application starts.
 * This data can be retrieved from a database as well, but here we are writing
 * this to a file.
 *
 * One downside to this method is that apiExists property will fail, if there is no route,
 * or any array in the registry.json file. It is recommended to use a relational database for
 * this purpose, but for ease of access we are using json file. This limits the ability to
 * truly have dynamic route system because if the array doesn't exist, there is no way to create one.
 */
router.post('/register', (req, res) => {

    const apiInfo = req.body;

    if (!apiExists(apiInfo)) {
        registry.services[apiInfo.apiName].push({ ...apiInfo });
    }

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

    if (!derievedAddress) {
        res.status(503)
            .send("Invalid Gateway Reference.")
        return null;
    }

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