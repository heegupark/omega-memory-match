const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3002

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

let sitename = 'heegu.net'
let name = 'Omegathrone'
let subtitle = 'Omegathrone makes'

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    sitename,
    title: 'Artistic Flower Memory Match Game',
    name,
    subtitle
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    sitename,
    title: 'Error 404',
    name: name,
    errorMessage: 'Page not found.',
    subtitle
  })
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
