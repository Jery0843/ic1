export interface User {
  id?: string;
  email: string;
  password?: string;
  name: string;
  mobile: string;
  address: string;
  category: string;
  auth_provider: 'email' | 'google';
  created_at?: string;
  abstract_status?: 'submitted' | 'accepted' | 'rejected' | null;
  abstract_submitted_at?: string;
  payment_status?: 'pending' | 'completed' | 'failed' | null;
  payment_completed_at?: string;
  payment_transaction_id?: string | null;
  payment_amount?: number | null;
  payment_date?: string | null;
  accompanying_persons?: number;
  workshop_participants?: number;
  paper_status?: 'submitted' | null;
  paper_submitted_at?: string;
}

export interface Admin {
  id?: string;
  email: string;
  password: string;
  created_at?: string;
}

class CloudflareD1Client {
  private apiToken: string;
  private accountId: string;
  private databaseId: string;
  private baseUrl: string;

  constructor() {
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    this.databaseId = process.env.CLOUDFLARE_DATABASE_ID!;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}`;
  }

  private async executeQuery(sql: string, params: any[] = []) {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudflare D1 query failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async createUsersTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        address TEXT NOT NULL,
        category TEXT NOT NULL,
        auth_provider TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `;
    return await this.executeQuery(sql);
  }

  async createUser(user: User) {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    const sql = `
      INSERT INTO users (id, email, password, name, mobile, address, category, auth_provider, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      user.email,
      user.password || null,
      user.name,
      user.mobile,
      user.address,
      user.category,
      user.auth_provider,
      created_at,
    ];

    await this.executeQuery(sql, params);
    
    return {
      id,
      ...user,
      password: undefined, // Don't return password
      created_at,
    };
  }

  async getUserByEmail(email: string) {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const result = await this.executeQuery(sql, [email]);
    
    if (result.success && result.result && result.result[0]?.results?.length > 0) {
      return result.result[0].results[0];
    }
    
    return null;
  }

  async updateUser(email: string, updates: Partial<User>) {
    const fields: string[] = [];
    const params: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'email' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    params.push(email);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE email = ?`;
    
    return await this.executeQuery(sql, params);
  }

  async getAllUsers() {
    const sql = `SELECT * FROM users ORDER BY created_at DESC`;
    const result = await this.executeQuery(sql);
    
    if (result.success && result.result && result.result[0]?.results) {
      return result.result[0].results;
    }
    
    return [];
  }

  // Admin table methods
  async createAdminsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `;
    return await this.executeQuery(sql);
  }

  async createAdmin(admin: Admin) {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    const sql = `
      INSERT INTO admins (id, email, password, created_at)
      VALUES (?, ?, ?, ?)
    `;
    
    const params = [id, admin.email, admin.password, created_at];
    await this.executeQuery(sql, params);
    
    return { id, email: admin.email, created_at };
  }

  async getAdminByEmail(email: string) {
    const sql = `SELECT * FROM admins WHERE email = ? LIMIT 1`;
    const result = await this.executeQuery(sql, [email]);
    
    if (result.success && result.result && result.result[0]?.results?.length > 0) {
      return result.result[0].results[0];
    }
    
    return null;
  }

  async getAllAdmins() {
    const sql = `SELECT id, email, created_at FROM admins ORDER BY created_at DESC`;
    const result = await this.executeQuery(sql);
    
    if (result.success && result.result && result.result[0]?.results) {
      return result.result[0].results;
    }
    
    return [];
  }

  async deleteAdminByEmail(email: string) {
    const sql = `DELETE FROM admins WHERE email = ?`;
    return await this.executeQuery(sql, [email]);
  }
}

export const db = new CloudflareD1Client();
