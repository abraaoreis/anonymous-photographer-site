import pg from 'pg';
const { Client } = pg;

async function testFilters() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/photographer_site'
    });

    try {
        await client.connect();

        console.log("--- Test 1: Check Problematic URLs ---");
        const searchRes = await client.query(
            "SELECT id, name, url, filename FROM photos WHERE name = 'undefined' OR filename = 'undefined'"
        );
        console.log("Photos with 'undefined' as string:", searchRes.rows);

        const allRes = await client.query("SELECT id, name, url FROM photos LIMIT 5");
        console.log("First 5 photos:", allRes.rows);

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
