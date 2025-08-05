import { Router } from "express"
import { GnssController } from "../controllers/gnss.js"

export const createGnssRouter = ({ gnssModel }) => {
    const gnssRouter = Router()

    const gnssController = new GnssController({ gnssModel })

    gnssRouter.post('/', gnssController.updateGnssData)

    return gnssRouter
}
