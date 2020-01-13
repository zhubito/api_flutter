const express = require("express");
const bodyParser = require('body-parser');
var User = require("./models/users").User;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Utilizar nuevas funcionalidades del Ecmascript 6
//'use strict'

// Cargamos el módulo de mongoose para poder conectarnos a MongoDB
var mongoose = require('mongoose');

//Jsons
let usuario = {
    email: '',
    pass: ''
};
let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
};

//Inicio
app.get('/', function (req, res) {
    respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Punto de inicio'
    };
    res.send(respuesta);
});

//Metodos usuario
app.route('/usuario')
    // .get(function (req, res) {
    //     conectar();
    // })
    .post(function (req, res) {
        conectar();
        if (!req.body.email || !req.body.pass) {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo email y pass son requeridos'
            };
        } else {
            if (req.body.consulta == true) {
                //validamos el email con la pass
                respuesta = {
                    error: true,
                    codigo: 200,
                    mensaje: 'El usuario no ha sido creado'
                };
        
                User.find({email: req.body.email}, function (err, docs) {
                    if(docs.length>0) {
                        if (docs[0].pass != req.body.pass ) {
                            respuesta = {
                                error: true,
                                codigo: 200,
                                mensaje: 'Contraseña Incorrecta'
                            };
                        } else {
                            respuesta = {
                                error: false,
                                codigo: 200,
                                mensaje: 'OK',
                            };
                        }
                    }
                    res.send(respuesta);
                }).
                 catch(err => console.log('error:', err.message));
                return;
            } else{
                if (usuario.email !== '' || usuario.pass !== '') {
                    respuesta = {
                        error: true,
                        codigo: 503,
                        mensaje: 'El usuario ya fue creado previamente'
                    };
                } else {
                    //verificamos si existe ya el email
                    User.find({email: req.body.email}, function (err, docs) {
                        if(docs.length == 0) {
                            //email no existe, puede crear
                            var user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                pass: req.body.pass
                            });
        
                            user.save();
                            respuesta = {
                                error: false,
                                codigo: 200,
                                mensaje: 'Usuario creado correctamente'
                            };
                        } else {
                            //email ya existe 
                            respuesta = {
                                error: true,
                                codigo: 200,
                                mensaje: 'Este email ya esta registrado'
                            };
                        }
                        res.send(respuesta);
                    }).
                    catch(err => console.log('error:', err.message));
                    return;
                }
            }
        }
        console.log(respuesta);
        res.send(respuesta);
    })
    .put(function (req, res) {
        if (!req.body.email || !req.body.pass) {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo email y pass son requeridos'
            };
        } else {
            if (usuario.email === '' || usuario.pass === '') {
                respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'El usuario no ha sido creado'
                };
            } else {
                usuario = {
                    email: req.body.email,
                    pass: req.body.pass
                };
                respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Usuario actualizado',
                    respuesta: usuario
                };
            }
        }

        res.send(respuesta);
    })
    .delete(function (req, res) {
        if (usuario.email === '' || usuario.pass === '') {
            respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'El usuario no ha sido creado'
            };
        } else {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Usuario eliminado'
            };
            usuario = {
                email: '',
                pass: ''
            };
        }
        res.send(respuesta);
    });


//Conexion
function conectar() {
    mongoose.connect('mongodb://localhost:27017/login', { useNewUrlParser: true, useUnifiedTopology: true });
}

//Not Found (404)
app.use(function (req, res, next) {
    respuesta = {
        error: true,
        codigo: 404,
        mensaje: 'URL no encontrada'
    };
    res.status(404).send(respuesta);
});

//Iniciamos server
app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});