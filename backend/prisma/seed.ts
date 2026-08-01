import { PrismaClient, UserRole, HackathonStatus, HackathonMode, HackathonVisibility, TeamStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Hackathon Central database seeding...');

  // Hash default password
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users
  console.log('👤 Seeding Users...');
  const participant = await prisma.user.upsert({
    where: { email: 'participant@hackathon.com' },
    update: {},
    create: {
      email: 'participant@hackathon.com',
      passwordHash,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'Full-stack AI developer & open-source contributor.',
      role: UserRole.PARTICIPANT,
      isEmailVerified: true,
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@hackathon.com' },
    update: {},
    create: {
      email: 'organizer@hackathon.com',
      passwordHash,
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Director of Hackathons & Ecosystem Partnerships.',
      role: UserRole.ORGANIZER,
      isEmailVerified: true,
    },
  });

  const judge = await prisma.user.upsert({
    where: { email: 'judge@hackathon.com' },
    update: {},
    create: {
      email: 'judge@hackathon.com',
      passwordHash,
      name: 'Dr. Evelyn Vance',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Principal AI Researcher at TechCorp Labs.',
      role: UserRole.JUDGE,
      isEmailVerified: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hackathon.com' },
    update: {},
    create: {
      email: 'admin@hackathon.com',
      passwordHash,
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Lead System Director for Hackathon Central.',
      role: UserRole.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Users created: ${participant.email}, ${organizer.email}, ${judge.email}, ${admin.email}`);

  // 2. Seed Hackathons
  console.log('🏆 Seeding Hackathons...');
  
  const hackathon1 = await prisma.hackathon.upsert({
    where: { slug: 'ai-innovators-2026' },
    update: {},
    create: {
      slug: 'ai-innovators-2026',
      title: 'AI Innovators Global Hackathon 2026',
      tagline: 'Build next-generation autonomous AI agents, multimodal LLM workflows, and edge intelligence.',
      description: 'The world\'s premier AI hackathon bringing together 5,000+ developers, researchers, and creators to build groundbreaking applications using cutting-edge LLMs and vision models.',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      status: HackathonStatus.IN_PROGRESS,
      mode: HackathonMode.HYBRID,
      visibility: HackathonVisibility.PUBLIC,
      location: 'San Francisco, CA & Virtual',
      startDate: new Date('2026-07-15T00:00:00Z'),
      endDate: new Date('2026-08-30T23:59:59Z'),
      registrationDeadline: new Date('2026-08-15T23:59:59Z'),
      submissionDeadline: new Date('2026-08-30T23:59:59Z'),
      prizePoolTotal: '₹40,00,000',
      maxTeamSize: 4,
      minTeamSize: 1,
      organizerId: organizer.id,
      tracks: {
        create: [
          { name: 'Generative AI & Agents', description: 'Autonomous multi-agent swarms and reasoning frameworks.' },
          { name: 'Multimodal Vision', description: 'Real-time video & image synthesis workflows.' },
          { name: 'Edge AI & Hardware', description: 'Low-latency quantized models on mobile & IoT.' },
        ],
      },
      problemStatements: {
        create: [
          {
            title: 'Autonomous Clinical Diagnostic Copilot',
            description: 'Build a multimodal AI agent capable of parsing medical imagery and patient history to suggest diagnostic differentials.',
            difficulty: 'ADVANCED',
          },
          {
            title: 'Real-time Edge Vision Quality Control',
            description: 'Optimize a vision pipeline to detect manufacturing micro-defects at 60 FPS on edge hardware.',
            difficulty: 'INTERMEDIATE',
          },
        ],
      },
      rubrics: {
        create: [
          { name: 'Technical Complexity & Innovation', description: 'Novelty of architecture and depth of implementation.', weight: 40 },
          { name: 'Impact & Practical Utility', description: 'Real-world usability and value creation.', weight: 30 },
          { name: 'UI/UX & User Experience', description: 'Polished interface and seamless user flow.', weight: 20 },
          { name: 'Presentation & Code Quality', description: 'Clean repository code, documentation, and video pitch.', weight: 10 },
        ],
      },
      prizes: {
        create: [
          { title: '🥇 Grand Champion', amount: '₹20,00,000', description: 'Overall top scoring project across all criteria.' },
          { title: '🥈 Runner Up', amount: '₹12,00,000', description: 'Second place overall winner.' },
          { title: '🥉 Best Edge AI Project', amount: '₹8,00,000', description: 'Top performing edge model implementation.' },
        ],
      },
    } as any,
  });

  const hackathon2 = await prisma.hackathon.upsert({
    where: { slug: 'web3-builder-sprint-2026' },
    update: {},
    create: {
      slug: 'web3-builder-sprint-2026',
      title: 'Web3 & Decentralized Scale-A-Thon',
      tagline: 'Architect high-throughput decentralized protocols, zero-knowledge proofs, and cross-chain dApps.',
      description: 'Join leading Web3 protocol architects to build decentralized infrastructure, ZK privacy tools, and cross-chain liquidity networks.',
      banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=300&q=80',
      status: HackathonStatus.REGISTRATION_OPEN,
      mode: HackathonMode.ONLINE,
      visibility: HackathonVisibility.PUBLIC,
      location: 'Global (Virtual)',
      startDate: new Date('2026-08-10T00:00:00Z'),
      endDate: new Date('2026-09-20T23:59:59Z'),
      registrationDeadline: new Date('2026-08-25T23:59:59Z'),
      submissionDeadline: new Date('2026-09-20T23:59:59Z'),
      prizePoolTotal: '₹80,00,000',
      maxTeamSize: 5,
      minTeamSize: 1,
      organizerId: organizer.id,
      tracks: {
        create: [
          { name: 'Zero-Knowledge Proofs', description: 'Privacy-preserving scaling primitives and circuits.' },
          { name: 'DeFi & Asset Liquidity', description: 'Automated market makers and decentralized vault protocols.' },
        ],
      },
      rubrics: {
        create: [
          { name: 'Protocol Security & Circuit Proofs', description: 'Auditability and smart contract safety.', weight: 50 },
          { name: 'Scalability & Gas Efficiency', description: 'Transaction throughput and gas optimizations.', weight: 30 },
          { name: 'Documentation & Demo', description: 'Setup instructions, unit tests, and demo walkthrough.', weight: 20 },
        ],
      },
      prizes: {
        create: [
          { title: '💎 Protocol Grand Prize', amount: '₹50,00,000', description: 'Top scoring Web3 protocol implementation.' },
          { title: '🛡️ Best ZK Circuit Winner', amount: '₹30,00,000', description: 'Best zero-knowledge application.' },
        ],
      },
    } as any,
  });

  console.log(`✅ Hackathons created: ${hackathon1.title}, ${hackathon2.title}`);

  // 3. Seed Team & Submissions
  console.log('👥 Seeding Teams & Submissions...');
  const team1 = await prisma.team.upsert({
    where: { inviteCode: 'ALPHA2026' },
    update: {},
    create: {
      name: 'Team Alpha — AI Health',
      inviteCode: 'ALPHA2026',
      hackathonId: hackathon1.id,
      createdById: participant.id,
      status: TeamStatus.APPROVED,
      members: {
        create: [
          { userId: participant.id, role: 'LEADER' },
        ],
      },
    } as any,
  });

  const existingSubmission = await prisma.submission.findFirst({
    where: { teamId: team1.id },
  });

  if (!existingSubmission) {
    await prisma.submission.create({
      data: {
        title: 'MediPulse AI — Autonomous Clinical Diagnostic Assistant',
        tagline: 'Multimodal AI copilot converting patient scans into instant diagnostic intelligence.',
        description: 'MediPulse AI combines vision language models with clinical knowledge bases to aid emergency room doctors in rapid triage.',
        hackathonId: hackathon1.id,
        teamId: team1.id,
        submitterId: participant.id,
        techStack: ['Python', 'PyTorch', 'React', 'FastAPI', 'PostgreSQL'],
        githubUrl: 'https://github.com/example/medipulse-ai',
        demoUrl: 'https://medipulse-ai.demo.dev',
        videoUrl: 'https://youtube.com/watch?v=example',
        isLocked: true,
      } as any,
    });
  }

  // 4. Seed Announcements
  console.log('📢 Seeding Announcements...');
  await prisma.announcement.createMany({
    data: [
      {
        hackathonId: hackathon1.id,
        title: '🚀 AI Innovators 2026 Submissions Officially Open!',
        content: 'Participants can now connect their GitHub repositories, submit demo video links, and request mentor code reviews.',
        type: 'UPDATE',
      },
      {
        hackathonId: hackathon1.id,
        title: '💡 Live Mentor Office Hours on Discord',
        content: 'Join Channel #mentor-help today at 6:00 PM for 1-on-1 architecture reviews with Senior AI Engineers.',
        type: 'INFO',
      },
    ] as any,
    skipDuplicates: true,
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
