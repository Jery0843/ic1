import { db } from '../lib/cloudflare-d1';

async function addPasswordColumn() {
  try {
    console.log('Adding password column to users table...');
    
    // Check if we need to add the column by trying to query it
    // If it fails, we'll add it via ALTER TABLE
    
    // For D1, we need to use the raw executeQuery method
    const sql = `ALTER TABLE users ADD COLUMN password TEXT`;
    
    // @ts-ignore - accessing private method for migration
    await db['executeQuery'](sql);
    
    console.log('✅ Password column added successfully!');
  } catch (error: any) {
    if (error.message?.includes('duplicate column name')) {
      console.log('✅ Password column already exists!');
    } else {
      console.error('❌ Error adding password column:', error);
      throw error;
    }
  }
}

addPasswordColumn().catch(console.error);
