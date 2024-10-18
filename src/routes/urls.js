const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { isLinkTaken, readDatabase, saveDatabase } = require('../utils/database')

// POST /acorta - Acortar una URL
router.post('/acorta', (req, res) => {
  const { user, url, tulink } = req.body
  const db = readDatabase()

  const codigo = tulink || uuidv4().split(0, 8)
  // Validar si el tulink ya está en uso
  if (isLinkTaken(db, codigo)) {
    return res.status(409).json({ error: 409, message: 'El link personalizado ya está en uso.' })
  }

  const nuevaUrl = {
    codigoTransaccion: uuidv4(),
    fechaGestion: new Date(),
    usuario: user,
    sitio: url,
    codigo,
    utiliza: `https://pico.li/${codigo}`,
    visitas: 0
  }

  db.push(nuevaUrl)
  saveDatabase(db)

  res.status(201).json(nuevaUrl)
})

// GET /validar/:tulink - Validar si un link personalizado está disponible
router.get('/validar/:tulink', (req, res) => {
  const { tulink } = req.params
  const db = readDatabase()

  if (tulink.length < 6 || tulink.length > 10) {
    return res.status(400).json({ error: 400, message: 'Los links deben contener entre 6 y 10 caracteres.' })
  }

  if (isLinkTaken(db, tulink)) {
    res.status(409).json({ codigo: 409, mensaje: 'El link ingresado no se encuentra disponible.' })
  } else {
    res.status(200).json({ codigo: 200, mensaje: 'El link ingresado está disponible para su uso.' })
  }
})

// GET /:codigo - Redireccionar a la URL original
router.get('/:codigo', (req, res) => {
  const { codigo } = req.params
  const db = readDatabase()

  const urlEncontrada = db.find((item) => item.codigo === codigo)

  if (urlEncontrada) {
    urlEncontrada.visitas += 1
    saveDatabase(db)
    res.redirect(urlEncontrada.sitio)
  } else {
    res.status(404).json({ error: 404, message: 'Recurso no encontrado.' })
  }
})

module.exports = router
