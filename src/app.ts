import * as express from 'express'
import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'

const app = express()

app.set('view engine', 'pug')
app.set('views', './src')

const addModuleToOurApp = addToEngine(app)

addModuleToOurApp(homeModule)
addModuleToOurApp(aboutModule)

export { app }