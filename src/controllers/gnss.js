export class GnssController {
    constructor ({ gnssModel }) {
        this.gnssModel = gnssModel
    }

    getAll = async (req, res) => {
        try {
            const data = await this.gnssModel.getAll(10, 2000)
            return res.status(200).json({ status: 200, message: 'Success', data })
        } catch (error) {
            console.error(error)
        }
    }

    readAll = async (req, res) => {
        try {
            console.log(req.body)
            return res.status(201).json({ status: 201, message: 'Body recibido' });
        } catch (error) {
            console.error(error)
        }
    }
}
