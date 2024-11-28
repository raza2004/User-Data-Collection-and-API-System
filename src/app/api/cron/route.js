import axios from 'axios';
import pool from '../../../lib/db'; // Adjust your database path

export const GET = async () => {
  try {
    // Fetch data from external API
    const { data } = await axios.get('https://randomuser.me/api/?results=5');
    const users = data.results;

    console.log('Fetched Users:', users);

    for (const user of users) {
      const { name, email, gender, location } = user;

      // Insert user into the database
      const userResult = await pool.query(
        `INSERT INTO users (name, email, gender, createdAt) 
         VALUES ($1, $2, $3, NOW()) RETURNING id`,
        [`${name.first} ${name.last}`, email, gender]
      );

      // Insert location for the user
      await pool.query(
        `INSERT INTO locations (userId, city, country) 
         VALUES ($1, $2, $3)`,
        [userResult.rows[0].id, location.city, location.country]
      );

      console.log('Inserted User ID:', userResult.rows[0].id);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Data fetched and stored successfully.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error in cron-like GET:', err.message);
    return new Response(
      JSON.stringify({ success: false, message: 'Error in fetching/storing data.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
