
const PORT = 3000,
    express = require('express');

const app = express();

app.use(express.json());


// sample request
app.get('/recordsApi', (req, res) => {
    res.send('Attempting to retrieve the endpoint : records')
})

app.listen(PORT, () => {
    console.log(`Application Server running at port : ${PORT}`);
})

