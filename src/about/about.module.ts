import { AppModule } from "../shared/interfaces/app-module.interface"
import { getAboutHandler } from "./about.handler"

export const aboutModule: AppModule = {
  get: {
    '/about': getAboutHandler
  }
} 