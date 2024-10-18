document.getElementById('acortar').addEventListener('click', async () => {
  const codigo = document.getElementById('codigo').value.trim()
  const url = document.getElementById('sitio').value.trim()
  const resultadoUrl = document.getElementById('resultado-url')

  // Limpiamos el resultado previo
  resultadoUrl.href = '#' // Restablecer el enlace
  resultadoUrl.textContent = 'Acá aparecerá la URL acortada' // Restablecer texto

  if (!url) {
    resultadoUrl.textContent = 'Por favor, ingresa una URL válida.'
    resultadoUrl.style.color = 'red'
    return
  }

  // Construimos el cuerpo de la petición según si se usó un código personalizado o no
  const data = codigo
    ? { tulink: codigo, user: 'Usuario Ejemplo', url }
    : { user: 'Usuario Ejemplo', url }

  try {
    // Enviamos la petición POST para acortar la URL
    const response = await fetch('/acorta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.status === 201) {
      // Mostrar la URL acortada
      resultadoUrl.href = result.utiliza // Actualiza el enlace
      resultadoUrl.textContent = result.utiliza // Actualiza el texto del enlace
      resultadoUrl.style.color = 'black' // Restablecer color del texto
    } else {
      // Mostrar el mensaje de error si ocurre algún problema
      resultadoUrl.textContent = `Error: ${result.message}`
      resultadoUrl.style.color = 'red'
    }
  } catch (error) {
    resultadoUrl.textContent = 'Hubo un problema con el servidor. Inténtalo de nuevo más tarde.'
    resultadoUrl.style.color = 'red'
  }
})
