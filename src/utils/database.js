const fs = require('fs')

// Función para validar si un tulink ya existe
const isLinkTaken = (db, tulink) => {
  return db.some((item) => item.codigo === tulink)
}

// Función para leer la base de datos
const readDatabase = () => {
  const data = fs.readFileSync('./src/data/database.json')
  return JSON.parse(data)
}

// Función para guardar en la base de datos
const saveDatabase = (data) => {
  fs.writeFileSync('./src/data/database.json', JSON.stringify(data, null, 2))
}

module.exports = {
  isLinkTaken,
  readDatabase,
  saveDatabase
}
