const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;

const {API_VERSION, IO_SERVER, PORT_DB} = require('./config');

mongoose.set("useFindAndModify", false);

// mogo db configuration
mongoose.connect(`mongodb+srv://strider:bhxxLGjhlverJSKZ@cluster0.nqxn1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
        if(err) {
            throw err;
        } else {
            console.log('Conexion establecida!');

            app.listen(port, () => {
                console.log(`http://${IO_SERVER}:${port}/api/${API_VERSION}/`);
            })
        }
    }
)