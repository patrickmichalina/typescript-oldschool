import * as express from 'express'
import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'

const app = express()
const addModuleToOurApp = addToEngine(app)

app.set('view engine', 'pug')
app.set('views', './src')

addModuleToOurApp(homeModule)
addModuleToOurApp(aboutModule)

export { app }