import pg from 'pg';
const { Client } = pg;

async function testFilters() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/photographer_site'
    });

    try {
        await client.connect();

        console.log("--- Test 1: Search 'fundo' in Name/Desc/Category ---");
        const searchRes = await client.query(
            "SELECT name, category, description, tags FROM photos WHERE (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1) ORDER BY created_at DESC",
            ['%fundo%']
        );
        console.log(searchRes.rows);

        console.log("\n--- Test 2: Filter by 'nature' Category or Tag ---");
        const tagRes = await client.query(
            "SELECT name, category, tags FROM photos WHERE (category = $1 OR $1 = ANY(tags)) ORDER BY created_at DESC",
            ['nature']
        );
        console.log(tagRes.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

testFilters();
