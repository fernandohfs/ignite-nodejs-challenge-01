const app = require('./');

const port = 3333;

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});