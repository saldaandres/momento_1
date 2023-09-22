const express = require('express')
const {json} = require("express");
const port = process.env.PORT || 3100
const app = express()

let properties = [
    {
        id: 1,
        address: 'Calle 55 # 68',
        value: 25
    },
    {
        id: 2,
        address: 'Carrera 35 # 67 - 78',
        value: 65
    }
]

let users = [
    {
        username: 'andres',
        fullname: 'andres saldarriaga',
        password: '123',
        role: '1'
    },
    {
        username: 'kelly',
        fullname: 'kelly montoya',
        password: '456',
        role: '0'
    }
]

app.use(express.urlencoded({extended: true}))
app.use(json())

async function getUser(usuario, contrasena) {
    return users.find(user => user.username === usuario && user.password === contrasena)
}



async function Login(req, res, next) {
    let username = req.params.username || req.body.username
    let password = req.params.password || req.body.password
    let usuario = await getUser(username, password)
    if (usuario) {
        req.usuario = usuario
        next()
    }
    else {
        res.send('Usuario invalido')
    }
}
async function propiedadYaExiste(id) {
    return properties.some(property => property.id === Number(id))
}

async function BuscarPropiedad(req, res, next)  {
    let {id} = req.body
    let yaExiste = await propiedadYaExiste(id)
    if (yaExiste) {
        res.send('La propiedad ya existe')
    }
    else {
        next()
    }
}

app.get('/:username/:password', Login, (req, res) => {
    res.sendfile('./index.html')
})

app.get('/customers/:username/:password', Login, (req, res) => {
    let usuario = req.usuario
    if (usuario) {
        if (usuario.role !== '1') {
            res.send(`Bienvenido usuario ${usuario.fullname}`)
        }
        else {
            res.send('No tienes un perfil de usuario')
        }
    }
})

app.get('/controlpanel/:username/:password', Login, (req, res) => {
    let usuario = req.usuario
    if (usuario) {
        if (usuario.role === '1') {
            res.send(`Bienvenido administrador ${usuario.fullname}`)
        }
        else {
            res.send('No tienes un perfil de admin')
        }
    }
})

app.get('/quienessomos', (req, res) => {
    res.send(`Estas en quienes somos por el metodo ${req.method}`)
})

app.put('/', (req, res) => {
    res.send(`Estas en el inicio por el metodo ${req.method}`)
})

app.delete('/student', (req, res) => {
    res.send(`Estas en la pagina de /students por el metodo ${req.method}`)
})

app.post('/properties', BuscarPropiedad, (req, res) => {
    let {id, address, value} = req.body
    nuevaPropiedad = {
        id: Number(id),
        address,
        value
    }
    properties = [
        ...properties,
        nuevaPropiedad
    ]
    res.json(properties)
})


app.listen(port, () => {
    console.log(`El servidor esta en http://localhost:${port}`)
})