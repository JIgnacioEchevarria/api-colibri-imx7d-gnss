import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { Client } from 'ssh2'

export class GnssModel {
    constructor(path = '/dev/colibri-uartb', baudRate = 9600) {
        this.path = path
        this.baudRate = baudRate

        this.port = null
        this.parser = null

        this.lines = []
    }

    async getAll(linesToRead = 10, timeoutMs = 2000) {
        this.lines = []

        const opened = await this.openPort()

        if (!opened) console.log('Error opening port')

        return this.lines
    }

    async openPort () {
        return new Promise((resolve, reject) => {
            if (this.port && this.port.isOpen) {
                return resolve(true)
            }

            this.port = new SerialPort({ path: this.path, baudRate: this.baudRate }, (err) => {
                if (err) {
                    console.error('Error abriendo puerto:', err.message);
                    return reject(false);
                }
                resolve(true);
            })

            this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }))

            this.parser.on('data', (line) => {
                line = line.trim()
                this.lines.push(line)
            })

            this.port.on('error', (err) => {
                console.error('UART error: ', err.message)
            })
        })
    }
}
