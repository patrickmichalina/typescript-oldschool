import { AppModule } from "../shared/interfaces/app-module.interface"
import { getIndexHandler } from "./home.handler"

export const homeModule: AppModule = {
  get: {
    '/': getIndexHandler
  }
} 