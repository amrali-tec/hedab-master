import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function generateAndExportMasterBlueprints() {
  console.log('================================================================');
  console.log('📜 GENERATING MASTER BLUEPRINT & TECHNOLOGY SIMULATION TREE');
  console.log('================================================================\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const targetDir = `F:\\HEDABKH_MASTER_BLUEPRINT_EXPORT_${timestamp}`;
  const desktopTargetZip = `C:\\Users\\amer3\\Desktop\\HEDABKH_MASTER_BLUEPRINT_AND_TREE_${timestamp}.zip`;
  const fDriveTargetZip = `F:\\HEDABKH_MASTER_BLUEPRINT_AND_TREE_${timestamp}.zip`;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Source files from release/
  const masterDocPath = path.join(process.cwd(), 'release', 'HEDABKH_FULL_PROJECT_MASTER_BLUEPRINT.md');
  const techTreeDocPath = path.join(process.cwd(), 'release', 'HEDABKH_TECHNOLOGY_SIMULATION_TREE.md');
  const techTreeJsonPath = path.join(process.cwd(), 'release', 'HEDABKH_TECHNOLOGY_SIMULATION_TREE.json');

  // Copy to external destination
  fs.copyFileSync(masterDocPath, path.join(targetDir, 'HEDABKH_FULL_PROJECT_MASTER_BLUEPRINT.md'));
  fs.copyFileSync(techTreeDocPath, path.join(targetDir, 'HEDABKH_TECHNOLOGY_SIMULATION_TREE.md'));
  fs.copyFileSync(techTreeJsonPath, path.join(targetDir, 'HEDABKH_TECHNOLOGY_SIMULATION_TREE.json'));

  console.log(`✅ Copied master blueprints to: ${targetDir}`);

  // Create ZIP archive
  try {
    execSync(`powershell -Command "Compress-Archive -Path '${targetDir}\\*' -DestinationPath '${fDriveTargetZip}' -Force"`);
    console.log(`✅ Created ZIP archive on Drive F: ${fDriveTargetZip}`);
  } catch (err: any) {
    console.warn(`Could not create F drive zip: ${err.message}`);
  }

  try {
    execSync(`powershell -Command "Copy-Item '${fDriveTargetZip}' '${desktopTargetZip}' -Force"`);
    console.log(`✅ Copied ZIP archive to Desktop: ${desktopTargetZip}`);
  } catch (err: any) {
    console.warn(`Could not copy zip to Desktop: ${err.message}`);
  }

  return { targetDir, fDriveTargetZip, desktopTargetZip };
}

generateAndExportMasterBlueprints()
  .then(res => {
    console.log('\n================================================================');
    console.log('🎉 MASTER BLUEPRINT & TECHNOLOGY SIMULATION TREE READY');
    console.log(`📁 Export Folder: ${res.targetDir}`);
    console.log(`📦 F: ZIP Archive: ${res.fDriveTargetZip}`);
    console.log(`📦 Desktop Archive: ${res.desktopTargetZip}`);
    console.log('================================================================\n');
  })
  .catch(err => {
    console.error('Generation failed:', err);
    process.exit(1);
  });
