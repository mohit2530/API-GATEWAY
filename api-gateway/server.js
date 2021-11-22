
const express = require('express'),
    routes = require('./routes'),
    helmet = require('helmet');

const PORT = 9000,
    app = express();

app.use(helmet());
app.use(express.json());
app.use("/school", routes)


app.listen(PORT, () => {
    console.log(`Api Gateway running on : ${PORT}`);
})