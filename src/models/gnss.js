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

        /**
         * Solo prueba LOCAL:
         * Hasta agregar NodeJS a la imagen Linux de la Colibri, nos conectamos via SSH para leer UART B
         * Ya que al estar corriendo en mi pc de desarrollo, el path /dev/colibri-uartb no existe.
         * Una vez que se agreguen los paquetes necesarios para correr NodeJS en la Colibri esto sera modificado.
         */
        if (!opened) {
            await this.connectSsh('192.168.0.177', 'root', 10)
        }

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

    async connectSsh (ip = '192.168.0.177', user = 'root', linesToRead = 10) {
        return new Promise((resolve, reject) => {
            const conn = new Client()
            let buffer = ''

            conn.on('ready', () => {
                conn.exec('./uart_ttl_mode.sh && cat /dev/colibri-uartb', (err, stream) => {
                    if (err) {
                        conn.end()
                        return reject(false)
                    }

                    stream.on('data', (data) => {
                        buffer += data.toString()

                        const parts = buffer.split('\n')

                        buffer = parts.pop()

                        for (const line of parts) {
                            if (line.trim().startsWith('$')) {
                                this.lines.push(line.trim())
                            }

                            if (this.lines.length >= linesToRead) {
                                stream.close()
                                conn.end()
                                return resolve(true)
                            }
                        }
                    })
                })
            }).connect({
                host: ip,
                username: user
            })
        })
    }
}
