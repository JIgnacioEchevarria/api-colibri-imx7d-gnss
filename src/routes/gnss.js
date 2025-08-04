import { Router } from "express"
import { GnssController } from "../controllers/gnss.js"

export const createGnssRouter = ({ gnssModel }) => {
    const gnssRouter = Router()

    const gnssController = new GnssController({ gnssModel })

    gnssRouter.get('/', gnssController.getAll)
    gnssRouter.post('/', gnssController.readAll)

    return gnssRouter
}
