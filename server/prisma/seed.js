const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ── Find existing company & users ──────────────────
  const companies = await prisma.company.findMany({ include: { users: true } });
  if (companies.length === 0) {
    console.log('❌ No company found. Please sign up first via the app.');
    return;
  }

  const company = companies[0];
  const users = company.users;
  console.log(`📦 Using company: "${company.name}" (${company.id})`);
  console.log(`👥 Found ${users.length} user(s)`);

  const admin = users.find((u) => u.role === 'ADMIN');
  const managers = users.filter((u) => u.role === 'MANAGER');
  const employees = users.filter((u) => u.role === 'EMPLOYEE');

  if (!admin) {
    console.log('❌ No ADMIN user found.');
    return;
  }

  // ── Ensure we have a manager hierarchy ─────────────
  // If no manager exists, create one under admin
  let manager;
  if (managers.length === 0) {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password123', 12);
    manager = await prisma.user.create({
      data: {
        name: 'Priya Sharma',
        email: 'priya@' + company.name.toLowerCase().replace(/\s+/g, '') + '.com',
        password: hash,
        role: 'MANAGER',
        companyId: company.id,
        managerId: admin.id,
      },
    });
    console.log(`✅ Created manager: ${manager.name}`);
  } else {
    manager = managers[0];
    // Ensure manager reports to admin
    if (!manager.managerId) {
      await prisma.user.update({
        where: { id: manager.id },
        data: { managerId: admin.id },
      });
    }
  }

  // If no employee exists, create two
  let empList = employees;
  if (empList.length === 0) {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password123', 12);
    const emp1 = await prisma.user.create({
      data: {
        name: 'Rahul Verma',
        email: 'rahul@' + company.name.toLowerCase().replace(/\s+/g, '') + '.com',
        password: hash,
        role: 'EMPLOYEE',
        companyId: company.id,
        managerId: manager.id,
      },
    });
    const emp2 = await prisma.user.create({
      data: {
        name: 'Anita Desai',
        email: 'anita@' + company.name.toLowerCase().replace(/\s+/g, '') + '.com',
        password: hash,
        role: 'EMPLOYEE',
        companyId: company.id,
        managerId: manager.id,
      },
    });
    empList = [emp1, emp2];
    console.log(`✅ Created employees: ${emp1.name}, ${emp2.name}`);
  }

  // ── Create approval rule if none exists ────────────
  const existingRules = await prisma.approvalRule.findMany({ where: { companyId: company.id } });
  if (existingRules.length === 0) {
    await prisma.approvalRule.create({
      data: {
        companyId: company.id,
        type: 'PERCENTAGE',
        percentageValue: 100,
      },
    });
    console.log('✅ Created approval rule: 100% PERCENTAGE');
  }

  // ── Sample expense data ────────────────────────────
  const categories = ['Travel', 'Food & Dining', 'Office Supplies', 'Software', 'Transport', 'Accommodation', 'Training', 'Client Meeting'];
  const descriptions = {
    'Travel':          ['Flight to Mumbai', 'Train to Delhi', 'Cab to airport', 'Business trip Bangalore', 'Interstate travel'],
    'Food & Dining':   ['Team lunch', 'Client dinner at Taj', 'Working lunch', 'Team celebration', 'Snacks for meeting'],
    'Office Supplies': ['Printer cartridges', 'Stationery items', 'Desk organizer', 'Whiteboard markers', 'Notebooks and pens'],
    'Software':        ['Figma Pro annual', 'GitHub Teams', 'Notion subscription', 'Adobe Creative Cloud', 'Slack upgrade'],
    'Transport':       ['Uber to client site', 'Auto to station', 'Monthly metro pass', 'Ola rides — week', 'Cab for late night'],
    'Accommodation':   ['Hotel in Pune — 2 nights', 'Airbnb Mumbai', 'Hotel Delhi conference', 'Guest house Jaipur', 'Resort for offsite'],
    'Training':        ['React workshop', 'AWS certification', 'Leadership seminar', 'UX bootcamp', 'Data science course'],
    'Client Meeting':  ['Coffee with client', 'Venue booking', 'Printing proposals', 'Gift for client', 'Presentation supplies'],
  };

  const now = new Date();
  const allSubmitters = [...empList, manager]; // Manager can also submit expenses

  // Generate 25 expenses spread over last 6 months
  const expensesToCreate = [];
  for (let i = 0; i < 25; i++) {
    const cat = categories[i % categories.length];
    const descList = descriptions[cat];
    const desc = descList[Math.floor(Math.random() * descList.length)];
    const monthsAgo = Math.floor(Math.random() * 6);
    const day = Math.floor(Math.random() * 27) + 1;
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    const submitter = allSubmitters[i % allSubmitters.length];

    // Amount ranges by category
    const amountRanges = {
      'Travel': [3000, 25000],
      'Food & Dining': [500, 5000],
      'Office Supplies': [200, 3000],
      'Software': [1000, 15000],
      'Transport': [100, 3000],
      'Accommodation': [2000, 20000],
      'Training': [2000, 30000],
      'Client Meeting': [500, 8000],
    };
    const [min, max] = amountRanges[cat];
    const amount = Math.round((Math.random() * (max - min) + min) / 10) * 10;

    expensesToCreate.push({ cat, desc, date, amount, submitter });
  }

  console.log(`\n📝 Creating ${expensesToCreate.length} expenses...`);

  let createdCount = 0;
  for (const exp of expensesToCreate) {
    // Build the approval chain for this submitter
    const chain = [];
    let currentId = exp.submitter.id;
    const visited = new Set();

    while (currentId) {
      const u = await prisma.user.findUnique({ where: { id: currentId }, select: { managerId: true } });
      if (!u || !u.managerId) break;
      if (visited.has(u.managerId)) break;
      visited.add(u.managerId);
      chain.push(u.managerId);
      currentId = u.managerId;
    }

    if (chain.length === 0) {
      // Skip if no approver chain (e.g. admin with no manager)
      continue;
    }

    // Decide final status: 60% approved, 20% pending, 20% rejected
    const roll = Math.random();
    let finalStatus, stepStatuses;

    if (roll < 0.6) {
      // APPROVED — all steps approved
      finalStatus = 'APPROVED';
      stepStatuses = chain.map(() => 'APPROVED');
    } else if (roll < 0.8) {
      // PENDING — some steps approved, current one pending
      finalStatus = 'PENDING';
      const approvedCount = Math.floor(Math.random() * chain.length);
      stepStatuses = chain.map((_, idx) => (idx < approvedCount ? 'APPROVED' : 'PENDING'));
    } else {
      // REJECTED — approved up to a point, then rejected
      finalStatus = 'REJECTED';
      const rejectAt = Math.floor(Math.random() * chain.length);
      stepStatuses = chain.map((_, idx) => {
        if (idx < rejectAt) return 'APPROVED';
        if (idx === rejectAt) return 'REJECTED';
        return 'PENDING';
      });
    }

    const currentStepOrder = finalStatus === 'APPROVED'
      ? chain.length
      : stepStatuses.findIndex((s) => s !== 'APPROVED') + 1 || 1;

    // Create expense + steps in a transaction
    await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          amount: exp.amount,
          currency: 'INR',
          category: exp.cat,
          description: exp.desc,
          date: exp.date,
          status: finalStatus,
          currentStepOrder,
          createdById: exp.submitter.id,
        },
      });

      const stepData = chain.map((approverId, idx) => ({
        expenseId: expense.id,
        approverId,
        sequenceOrder: idx + 1,
        status: stepStatuses[idx],
        comments: stepStatuses[idx] === 'APPROVED'
          ? ['Looks good', 'Approved', 'Valid expense', 'OK'][Math.floor(Math.random() * 4)]
          : stepStatuses[idx] === 'REJECTED'
            ? ['Exceeds budget', 'Missing receipt', 'Not a valid business expense'][Math.floor(Math.random() * 3)]
            : null,
      }));

      await tx.approvalStep.createMany({ data: stepData });
    });

    createdCount++;
  }

  console.log(`✅ Created ${createdCount} expenses with approval chains\n`);

  // ── Summary ────────────────────────────────────────
  const totals = await prisma.expense.groupBy({
    by: ['status'],
    where: { createdBy: { companyId: company.id } },
    _count: true,
    _sum: { amount: true },
  });

  console.log('📊 Database summary:');
  for (const t of totals) {
    console.log(`   ${t.status}: ${t._count} expenses, ₹${t._sum.amount?.toLocaleString('en-IN')}`);
  }

  const userCount = await prisma.user.count({ where: { companyId: company.id } });
  console.log(`   Total users: ${userCount}`);
  console.log('\n🎉 Seed complete! Refresh your dashboard.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
