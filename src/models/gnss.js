import Database from 'better-sqlite3'

export class GnssModel {
    constructor() {
        this.db = new Database('gnssDatabase')
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS gngga (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude REAL,
                longitude REAL,
                altitude REAL,
                satellites INTEGER,
                created_at TEXT DEFAULT (datetime('now'))
            )
        `).run()
    }

    getGnssData() {
        const data = this.db.prepare(`
            SELECT * FROM gngga
            ORDER BY created_at DESC
            LIMIT 1
        `).get()

        return data
    }

    saveGnssData(data) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO gngga (latitude, longitude, altitude, satellites)
                VALUES (?, ?, ?, ?)
            `);

            stmt.run(data.latitude, data.longitude, data.altitude, data.satellites)
        } catch (error) {
            throw error
        }
    }
}
