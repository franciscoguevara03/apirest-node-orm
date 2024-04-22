import { Router } from 'express'
import 'dotenv/config'
import axios from 'axios'
import cheerio from 'cheerio'
import https from 'https'


const router = Router()

router.get('/changetypeall', (req, res) => {
  try {
    axios.get(process.env.URL_FECTH_ALL, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
      .then(response => {
        const $ = cheerio.load(response.data)
        const dolar = $('#dolar').find('div').find('div').find('div').eq(1).find('strong').text()
        const euro = $('#euro').find('div').find('div').find('div').eq(1).find('strong').text()
        const yuan = $('#yuan').find('div').find('div').find('div').eq(1).find('strong').text()
        const lira = $('#lira').find('div').find('div').find('div').eq(1).find('strong').text()
        const rublo = $('#rublo').find('div').find('div').find('div').eq(1).find('strong').text()
        
        const data = {
            "euro": euro,
            "yuan": yuan,
            "lira": lira,
            "rublo": rublo,
            "dolar": dolar
        }

        console.log(data)
        res.json(data)
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al procesar la solicitud' })
    }

})

router.get('/changetypedolar', (req, res) => {
  try {
    axios.get(process.env.URL_FECTH_DOLAR, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
      .then(response => {
        const $ = cheerio.load(response.data)
        const dolar = $('#dolar').find('div').find('div').find('div').eq(1).find('strong').text()
        
        const data = {
          "dolar": dolar
        }

        console.log(data)
        res.json(data)
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al procesar la solicitud' })
    }

})

export default router