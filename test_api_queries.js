import 'dotenv/config';
import supabase from './server/db.js';

async function testOverview() {
  const { data, error } = await supabase
    .from('user_analytics')
    .select('event_type, page_path, session_id, click_x, created_at, element_name')
    .limit(1);

  if (error) {
    console.error("Overview Query Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Overview Query Success!");
  }
}

async function testSessions() {
  const { data, error } = await supabase
    .from('user_analytics')
    .select('session_id, page_path, event_type, created_at, user_agent, ip_address, viewport_width, viewport_height')
    .limit(1);

  if (error) {
    console.error("Sessions Query Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Sessions Query Success!");
  }
}

async function testTopElements() {
  const { data, error } = await supabase
    .from('user_analytics')
    .select('element_tag, element_id, element_text, element_clicked, element_name, page_path')
    .limit(1);

  if (error) {
    console.error("Top Elements Query Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Top Elements Query Success!");
  }
}

async function runAll() {
  console.log("Testing Supabase Queries...");
  await testOverview();
  await testSessions();
  await testTopElements();
}

runAll();
