async function migratePaymentColumns() {
  // Load environment variables from .env.local
  const fs = await import('fs');
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length) {
        process.env[key.trim()] = values.join('=').trim();
      }
    });
  }
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;

  if (!apiToken || !accountId || !databaseId) {
    console.error('Missing required environment variables');
    console.error('Required: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID');
    process.exit(1);
  }

  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

  const alterStatements = [
    'ALTER TABLE users ADD COLUMN payment_transaction_id TEXT DEFAULT NULL',
    'ALTER TABLE users ADD COLUMN payment_amount REAL DEFAULT NULL',
    'ALTER TABLE users ADD COLUMN payment_date TEXT DEFAULT NULL',
    'ALTER TABLE users ADD COLUMN accompanying_persons INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN workshop_participants INTEGER DEFAULT 0',
  ];

  console.log('🚀 Starting payment columns migration...\n');

  for (const statement of alterStatements) {
    try {
      const response = await fetch(`${baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: statement,
          params: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${statement.split('ADD COLUMN')[1]?.trim() || statement}`);
      } else {
        const error = data.errors?.[0]?.message || 'Unknown error';
        if (error.includes('duplicate column name')) {
          console.log(`⚠️  Column already exists: ${statement.split('ADD COLUMN')[1]?.trim()}`);
        } else {
          console.error(`❌ Error: ${error}`);
        }
      }
    } catch (error: any) {
      console.error(`❌ Failed: ${error.message}`);
    }
  }

  console.log('\n✨ Migration completed!');
}

migratePaymentColumns().catch(console.error);
