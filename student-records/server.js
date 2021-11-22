
const PORT = 3000,
    axios = require('axios'),
    express = require('express');

const app = express();

app.use(express.json());


// sample request
app.get('/recordsApi', (req, res) => {
    res.send('Attempting to retrieve the endpoint : records')
})

// registering the api endpoints to the gateway from here
app.listen(PORT, () => {
    axios({
        method: 'POST',
        url: "http://localhost:9000/school/register",
        headers: { 'Content-Type': 'application/json' },
        data: {
            portEnv: "3000",
            apiName: "/records",
            host: "http://localhost:"
        }
    }).then( () => console.log(`Successfully registered Api.`))
        .catch(err => console.log(`Gateway Failure. Invalid Setup of Api.` + "\n" + err))

    console.log(`Application Server running at port : ${PORT}`);
})

