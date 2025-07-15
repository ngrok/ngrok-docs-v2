import fs from 'fs/promises';
import path from 'path';
import { getSidebar } from '../utils/sidebar';

async function generateSidebarData() {
  console.log('Generating sidebar data...');
  const sidebarData = await getSidebar();
  const processedData = sidebarData.map((item: any) => item.value);
  
  await fs.writeFile(
    path.join(process.cwd(), '/app/generated/sidebar.json'),
    JSON.stringify(processedData, null, 2)
  );
  console.log('Sidebar data generated successfully');
}

generateSidebarData().catch(console.error);
