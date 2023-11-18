import sql from 'mssql';

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'localhost',
    database: 'dbprueba',
    options:{
        encrypt: true,
        trustServerCertificate: true
    }
}
export async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.log(error);
    }
}
export async function getUserFromDatabase(userId) {
    const pool = await getConnection();
    const result = await pool.request().input('ClienteID', sql.Int, userId).query('SELECT * FROM Clientes WHERE ClienteID = @ClienteID');
    return result.recordset[0];
}
export async function updateUserInDatabase(userId, updatedUser) {
    const pool = await getConnection();
    const result = await pool.request().input('ClienteID', sql.Int, userId).input('Nombre', sql.VarChar, updatedUser.Nombre).input('Apellido', sql.VarChar, updatedUser.Apellido).input('Anios', sql.Int, updatedUser.Anios).input('Correo', sql.VarChar, updatedUser.Correo).query('UPDATE Clientes SET Nombre = @Nombre, Apellido = @Apellido, Anios = @Anios, Correo = @Correo WHERE ClienteID = @ClienteID');
    return result.rowsAffected[0] > 0;
}