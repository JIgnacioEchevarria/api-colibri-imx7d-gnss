export class GnssController {
    constructor ({ gnssModel }) {
        this.gnssModel = gnssModel
    }

    getGnssData = async (req, res) => {
        try {
            const data = this.gnssModel.getGnssData()
            return res.status(200).json({ status: 200, message: 'Gnss data successfully retrieved.', data })
        } catch (error) {
            return res.status(404).json({ status: 404, message: 'Gnss data not found.' })
        }
    }

    updateGnssData = async (req, res) => {
        try {
            console.log(req.body)
            this.gnssModel.saveGnssData(req.body)
            return res.status(201).json({ status: 201, message: 'Gnss data received.' })
        } catch (error) {
            return res.status(422).json({ status: 422, message: 'Invalid Gnss data.' })
        }
    }
}
