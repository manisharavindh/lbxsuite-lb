import 'dotenv/config';
import supabase from './server/db.js';

async function test() {
  const { data, error } = await supabase.rpc('execute_sql_from_file', { sql: '' });
  console.log("RPC Error?", error);

  // Instead of querying properties, we can execute the actual schema!
  // Wait, the user needs to apply the schema migration.
  console.log("Checking columns by inserting a blank row...");
  const res = await supabase.from('user_analytics').insert([{}]);
  console.log(res);
}

test();
