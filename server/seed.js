import { pool, initDatabase } from './db.js';

async function seedDatabase() {
  await initDatabase();
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding PostgreSQL Database...');

    // 1. Seed Hackathons
    const hackathonCheck = await client.query('SELECT COUNT(*) FROM hackathons');
    if (parseInt(hackathonCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO hackathons (id, title, organizer_name, organizer_initials, status, mode, prize_pool, time_left, difficulty, tags, image_gradient, featured, category)
        VALUES 
          ('h1', 'AI Innovation Challenge 2026', 'TechCorp AI', 'TC', 'Live', 'Hybrid', '$50K', '2 Days Left', 'Advanced', ARRAY['Python', 'TensorFlow', 'React'], 'from-emerald-500/80 to-teal-700/80', true, 'AI & ML'),
          ('h2', 'Green Tech Hackathon', 'EcoSystems Inc.', 'ES', 'Upcoming', 'Online', '$25K', 'In 5 Days', 'Intermediate', ARRAY['IoT', 'Node.js', 'Vue'], 'from-blue-500/80 to-indigo-700/80', false, 'Green Tech'),
          ('h3', 'Web3 Builder Sprint', 'CryptoNet', 'CN', 'Closing Soon', 'Online', '$100K', '12 Hours Left', 'Advanced', ARRAY['Solidity', 'Next.js', 'Rust'], 'from-purple-500/80 to-fuchsia-700/80', true, 'Web3'),
          ('h4', 'Cloud Native Hack', 'CloudFoundry', 'CF', 'Live', 'Hybrid', '$30K', '4 Days Left', 'Intermediate', ARRAY['Kubernetes', 'Go', 'Docker'], 'from-cyan-500/80 to-blue-700/80', false, 'Cloud Native'),
          ('h5', 'FinTech Disrupt 2026', 'GlobalBank', 'GB', 'Upcoming', 'Hybrid', '$75K', 'In 2 Weeks', 'Beginner', ARRAY['Java', 'Spring', 'Angular'], 'from-rose-500/80 to-orange-700/80', false, 'FinTech');
      `);
      console.log('✅ Seeded 5 Hackathons!');
    }

    // 2. Seed Judges
    const judgeCheck = await client.query('SELECT COUNT(*) FROM judges');
    if (parseInt(judgeCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO judges (id, name, email, expertise, assigned_track, status, avatar)
        VALUES 
          ('j1', 'Dr. Sarah Chen', 'sarah.chen@ai-research.org', 'Generative AI & LLMs', 'AI Innovation Challenge 2026', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
          ('j2', 'Alex Rivera', 'alex@web3ventures.io', 'Smart Contracts & Rust', 'Web3 Builder Sprint', 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
          ('j3', 'Marcus Vance', 'marcus@cloudnative.dev', 'Kubernetes & Systems', 'Cloud Native Hack', 'Active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80');
      `);
      console.log('✅ Seeded 3 Appointed Judges!');
    }

    // 3. Seed Organizers
    const orgCheck = await client.query('SELECT COUNT(*) FROM organizers');
    if (parseInt(orgCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO organizers (id, name, email, organization, verified, events_count)
        VALUES 
          ('o1', 'Elena Rostova', 'elena@techcorp.ai', 'TechCorp AI Labs', true, 4),
          ('o2', 'David Miller', 'david@ecosystems.org', 'EcoSystems Global', true, 2),
          ('o3', 'Priya Sharma', 'priya@cryptonet.foundation', 'CryptoNet Foundation', false, 1);
      `);
      console.log('✅ Seeded 3 Verified Organizers!');
    }

    console.log('🎉 Database seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();
