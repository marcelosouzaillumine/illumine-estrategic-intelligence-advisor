import * as lucide from 'lucide-react';

const icons = [
  'Map', 'Brain', 'Eye', 'HeartPulse', 'BarChart2', 'Factory', 'Target', 'Building',
  'Handshake', 'UserPlus', 'Sitemap', 'UserCog', 'Settings2', 'Share2', 'GitGraph',
  'Gem', 'GraduationCap', 'Magnet', 'PackageCheck', 'PiggyBank', 'ShoppingCart',
  'Tags', 'Coins', 'MessageCircle', 'LifeBuoy', 'DatabaseBackup', 'Briefcase'
];

icons.forEach(i => {
  if (!lucide[i]) console.log(`MISSING: ${i}`);
});
console.log("Check complete.");
