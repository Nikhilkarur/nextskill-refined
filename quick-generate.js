const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, 'backend', 'src', 'main', 'resources', 'learning-paths');

const ROLES = ['software-engineer', 'data-scientist', 'devops-engineer', 'product-manager', 'ux-designer', 'data-engineer'];
const EXPERIENCES = ['junior', 'mid', 'senior'];  
const PRIORITIES = ['skills', 'projects'];
const TIME_COMMITMENTS = ['part-time', 'full-time'];

// Simplified skill sets per role
const ROLE_SKILLS = {
  'software-engineer': ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Git', 'Testing'],
  'data-scientist': ['Python', 'Machine Learning', 'Statistics', 'Pandas', 'TensorFlow', 'SQL', 'Jupyter', 'Data Visualization'],
  'product-manager': ['Product Strategy', 'User Research', 'Analytics', 'Roadmapping', 'Stakeholder Management', 'Agile', 'Go-to-Market'],
  'devops-engineer': ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Monitoring', 'Security'],
  'ux-designer': ['User Research', 'Figma', 'Prototyping', 'Design Systems', 'User Testing', 'Wireframing', 'Information Architecture'],
  'data-engineer': ['Python', 'SQL', 'Apache Spark', 'ETL', 'Data Warehousing', 'Kafka', 'Airflow', 'AWS']
};

function generateLearningPath(role, experience, priority, timeCommitment) {
  const skills = ROLE_SKILLS[role] || [];
  const baseWeeks = experience === 'junior' ? 18 : experience === 'mid' ? 16 : 14;
  const timeMultiplier = timeCommitment === 'part-time' ? 1.5 : 1;
  const totalWeeks = Math.round(baseWeeks * timeMultiplier);
  
  return {
    role,
    experience,
    priority,
    timeCommitment,
    title: `${role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${experience.charAt(0).toUpperCase() + experience.slice(1)} - ${priority.charAt(0).toUpperCase() + priority.slice(1)} Focus`,
    difficulty: experience === 'junior' ? 'Beginner' : experience === 'mid' ? 'Intermediate' : 'Advanced',
    duration_weeks: totalWeeks,
    skills: skills,
    phases: [
      { name: 'Foundation', duration_weeks: Math.ceil(totalWeeks / 3), skills: skills.slice(0, 3) },
      { name: 'Intermediate', duration_weeks: Math.ceil(totalWeeks / 3), skills: skills.slice(3, 6) },
      { name: 'Advanced', duration_weeks: Math.floor(totalWeeks / 3), skills: skills.slice(6) }
    ]
  };
}

console.log('🚀 Generating learning path files...');
let generated = 0;

for (const role of ROLES) {
  const roleDir = path.join(BASE_PATH, role);
  
  if (!fs.existsSync(roleDir)) {
    fs.mkdirSync(roleDir, { recursive: true });
  }
  
  for (const experience of EXPERIENCES) {
    for (const priority of PRIORITIES) {
      for (const timeCommitment of TIME_COMMITMENTS) {
        const filename = `${experience}_${priority}_${timeCommitment}.json`;
        const filepath = path.join(roleDir, filename);
        
        try {
          const learningPath = generateLearningPath(role, experience, priority, timeCommitment);
          fs.writeFileSync(filepath, JSON.stringify(learningPath, null, 2));
          console.log(`✅ ${role}/${filename}`);
          generated++;
        } catch (error) {
          console.error(`❌ Error: ${role}/${filename}:`, error.message);
        }
      }
    }
  }
}

console.log(`\n📊 Generated ${generated} learning path files!`);
console.log(`📁 Expected: ${ROLES.length * EXPERIENCES.length * PRIORITIES.length * TIME_COMMITMENTS.length} files`);