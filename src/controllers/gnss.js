export class GnssController {
    constructor ({ gnssModel }) {
        this.gnssModel = gnssModel
    }

    updateGnssData = async (req, res) => {
        try {
            console.log(req.body)
            return res.status(201).json({ status: 201, message: 'Gnss data received.' });   
        } catch (error) {
            return res.status(422).json({ status: 422, message: 'Invalid Gnss data.' })
        }
    }
}
