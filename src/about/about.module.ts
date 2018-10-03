import { AppModule } from "../shared/interfaces/app-module.interface"
import { getAboutHandler } from "./about.handlers"

export const aboutModule: AppModule = {
  get: {
    '/about': getAboutHandler
  }
} 