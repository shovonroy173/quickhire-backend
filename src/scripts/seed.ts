import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../config/logger';
import { Job } from '../modules/job/models/job.model';
import { User } from '../modules/user/model/user.model';

const seedUsers = [
  {
    name: 'QuickHire Admin',
    email: 'admin@quickhire.dev',
    password: 'Admin123!',
    role: 'admin' as const,
  },
  {
    name: 'Ava Martin',
    email: 'ava.martin@quickhire.dev',
    password: 'User123!',
    role: 'user' as const,
  },
  {
    name: 'Liam Carter',
    email: 'liam.carter@quickhire.dev',
    password: 'User123!',
    role: 'user' as const,
  },
];

const seedJobData = [
  {
    title: 'Senior Frontend Engineer',
    company: 'NovaStack',
    location: 'Austin, TX',
    category: 'Technology',
    type: 'Full-time',
    description:
      'Build and scale a production React platform with strong focus on performance, accessibility, and developer experience across multiple product squads.',
    requirements: ['5+ years React', 'TypeScript', 'State management experience'],
    responsibilities: ['Lead UI architecture', 'Mentor engineers', 'Collaborate with design'],
    benefits: ['Health insurance', '401(k)', 'Remote-friendly'],
    salary: '$145k - $175k',
    experienceLevel: 'Senior',
    featured: true,
    verified: true,
    status: 'active',
  },
  {
    title: 'Product Designer',
    company: 'PixelCraft',
    location: 'New York, NY',
    category: 'Design',
    type: 'Full-time',
    description:
      'Own end-to-end product design from discovery to final handoff while partnering closely with PM and engineering to ship meaningful user outcomes.',
    requirements: ['Figma expertise', 'Portfolio required', 'Design systems'],
    responsibilities: ['User research', 'Wireframes', 'Prototype testing'],
    benefits: ['Medical coverage', 'Learning budget', 'Flexible PTO'],
    salary: '$110k - $135k',
    experienceLevel: 'Mid',
    featured: true,
    verified: true,
    status: 'active',
  },
  {
    title: 'Growth Marketing Specialist',
    company: 'BrightReach',
    location: 'Remote',
    category: 'Marketing',
    type: 'Remote',
    description:
      'Drive acquisition and retention campaigns through paid and lifecycle channels, then iterate quickly using data-backed experimentation practices.',
    requirements: ['Performance marketing', 'Analytics', 'A/B testing'],
    responsibilities: ['Launch campaigns', 'Analyze funnels', 'Report KPI trends'],
    benefits: ['Remote stipend', 'Team retreats', 'Performance bonus'],
    salary: '$85k - $105k',
    experienceLevel: 'Mid',
    featured: false,
    verified: true,
    status: 'active',
  },
  {
    title: 'Backend Engineer',
    company: 'CloudAxis',
    location: 'Seattle, WA',
    category: 'Engineering',
    type: 'Full-time',
    description:
      'Design resilient backend services and APIs with clear observability standards, while improving reliability and runtime cost for core workflows.',
    requirements: ['Node.js', 'MongoDB', 'Distributed systems'],
    responsibilities: ['Build APIs', 'Improve reliability', 'Own service performance'],
    benefits: ['Stock options', 'Medical and dental', 'Wellness budget'],
    salary: '$135k - $165k',
    experienceLevel: 'Senior',
    featured: false,
    verified: true,
    status: 'active',
  },
  {
    title: 'Finance Analyst',
    company: 'LedgerLane',
    location: 'Chicago, IL',
    category: 'Finance',
    type: 'Full-time',
    description:
      'Support forecasting and planning with clean financial models and executive-ready reporting that enables faster and smarter business decisions.',
    requirements: ['Financial modeling', 'Excel/Sheets', 'Business partnering'],
    responsibilities: ['Forecasting', 'Scenario planning', 'Reporting'],
    benefits: ['Annual bonus', 'Hybrid work', 'Professional development'],
    salary: '$90k - $120k',
    experienceLevel: 'Mid',
    featured: false,
    verified: false,
    status: 'active',
  },
  {
    title: 'HR Operations Coordinator',
    company: 'PeopleFirst',
    location: 'Denver, CO',
    category: 'Human Resource',
    type: 'Part-time',
    description:
      'Coordinate key HR processes and improve employee operations from onboarding through lifecycle updates while maintaining compliance standards.',
    requirements: ['HR operations', 'Documentation skills', 'Stakeholder communication'],
    responsibilities: ['Onboarding support', 'Policy updates', 'People ops coordination'],
    benefits: ['Flexible hours', 'Learning stipend', 'Health benefits'],
    salary: '$55k - $70k',
    experienceLevel: 'Entry',
    featured: false,
    verified: false,
    status: 'active',
  },
];

const runSeed = async (): Promise<void> => {
  await connectDatabase();

  try {
    await Promise.all([User.deleteMany({}), Job.deleteMany({})]);

    const users = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      }))
    );

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find((user) => user.role === 'admin');

    if (!adminUser) {
      throw new Error('Admin user was not created');
    }

    await Job.insertMany(
      seedJobData.map((job, index) => ({
        ...job,
        postedBy: adminUser._id,
        postedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      }))
    );

    logger.info('Seed completed successfully');
    logger.info(`Users seeded: ${createdUsers.length}`);
    logger.info(`Jobs seeded: ${seedJobData.length}`);
    logger.info('Admin credentials: admin@quickhire.dev / Admin123!');
  } finally {
    await disconnectDatabase();
  }
};

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Seed failed', error);
    process.exit(1);
  });
