import 'dotenv/config';
import supabase from './server/db.js';

async function test() {
  console.log("Testing inserting tracking data...");
  const { data, error } = await supabase.from('user_analytics').insert([{
    event_type: 'click',
    element_tag: 'test',
    element_name: 'Test Element',
    page_path: '/',
    session_id: 'test-123'
  }]);
  
  if (error) {
    console.error("Supabase Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success inserting test click!");
  }
}

test();
