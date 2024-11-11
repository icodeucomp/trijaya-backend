const { execSync } = require('child_process');

console.log('Starting Prisma migration and client generation...');

// Apply Prisma migrations
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Prisma migrations applied successfully');
} catch (error) {
  console.error('Prisma migration failed', error);
  process.exit(1); // Exit if migrations fail
}

// Generate Prisma client
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Prisma client generation failed', error);
  process.exit(1); // Exit if client generation fails
}

// Start the NestJS app
try {
  execSync('npm run start:prod', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start the application', error);
  process.exit(1); // Exit if the app fails to start
}
