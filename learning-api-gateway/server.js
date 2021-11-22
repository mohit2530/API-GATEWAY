
const express = require('express'),
    routes = require('./routes')

const PORT = 9000,
    app = express();

app.use(express.json());
app.use("/school", routes)


app.listen(PORT, () => {
    console.log(`Api Gateway running on : ${PORT}`);
})