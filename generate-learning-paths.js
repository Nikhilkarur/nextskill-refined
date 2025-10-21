#!/usr/bin/env node

// Script to populate all learning path JSON files systematically
// Run this to generate comprehensive learning paths for all role/experience/priority/time combinations

const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, 'backend', 'src', 'main', 'resources', 'learning-paths');

// Define all possible combinations
const ROLES = {
  'software-engineer': 'Software Engineer',
  'data-scientist': 'Data Scientist', 
  'devops-engineer': 'DevOps Engineer',
  'product-manager': 'Product Manager',
  'ux-designer': 'UX Designer',
  'data-engineer': 'Data Engineer'
};

const EXPERIENCES = ['junior', 'mid', 'senior'];
const PRIORITIES = ['skills', 'projects'];
const TIME_COMMITMENTS = ['part-time', 'full-time'];

// Learning path templates for each role
const LEARNING_PATHS = {
  'software-engineer': {
    skills: {
      junior: ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Git', 'SQL', 'REST APIs', 'Testing'],
      mid: ['System Design', 'Docker', 'AWS', 'TypeScript', 'GraphQL', 'Microservices', 'CI/CD'],
      senior: ['Architecture', 'Team Leadership', 'Performance Optimization', 'Security', 'Scalability']
    },
    phases: {
      junior: [
        { name: 'Web Fundamentals', weeks: 6, skills: ['HTML/CSS', 'JavaScript'] },
        { name: 'Frontend Development', weeks: 6, skills: ['React', 'Testing'] },
        { name: 'Backend Development', weeks: 6, skills: ['Node.js', 'SQL', 'REST APIs'] }
      ],
      mid: [
        { name: 'Advanced Frontend', weeks: 5, skills: ['TypeScript', 'Advanced React'] },
        { name: 'Backend & DevOps', weeks: 6, skills: ['Docker', 'AWS', 'CI/CD'] },
        { name: 'System Design', weeks: 5, skills: ['System Design', 'Microservices'] }
      ],
      senior: [
        { name: 'Architecture', weeks: 6, skills: ['Architecture', 'Scalability'] },
        { name: 'Leadership', weeks: 5, skills: ['Team Leadership', 'Code Review'] },
        { name: 'Optimization', weeks: 5, skills: ['Performance', 'Security'] }
      ]
    }
  },
  'data-scientist': {
    skills: {
      junior: ['Python', 'Statistics', 'Pandas', 'NumPy', 'Matplotlib', 'SQL', 'Machine Learning', 'Jupyter'],
      mid: ['Deep Learning', 'TensorFlow', 'Feature Engineering', 'MLOps', 'Big Data', 'Spark'],
      senior: ['Research', 'Model Architecture', 'Team Leadership', 'Business Strategy', 'Advanced ML']
    },
    phases: {
      junior: [
        { name: 'Programming & Stats', weeks: 6, skills: ['Python', 'Statistics', 'SQL'] },
        { name: 'Data Analysis', weeks: 6, skills: ['Pandas', 'NumPy', 'Matplotlib'] },
        { name: 'Machine Learning', weeks: 6, skills: ['Machine Learning', 'Scikit-learn'] }
      ],
      mid: [
        { name: 'Deep Learning', weeks: 6, skills: ['Deep Learning', 'TensorFlow'] },
        { name: 'MLOps', weeks: 5, skills: ['MLOps', 'Model Deployment'] },
        { name: 'Big Data', weeks: 5, skills: ['Big Data', 'Spark'] }
      ],
      senior: [
        { name: 'Research & Innovation', weeks: 6, skills: ['Research', 'Advanced ML'] },
        { name: 'Leadership', weeks: 5, skills: ['Team Leadership', 'Strategy'] },
        { name: 'Architecture', weeks: 5, skills: ['Model Architecture', 'Optimization'] }
      ]
    }
  },
  'product-manager': {
    skills: {
      junior: ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'Agile'],
      mid: ['Growth Strategy', 'Pricing', 'Go-to-Market', 'Team Leadership', 'Advanced Analytics'],
      senior: ['Executive Strategy', 'P&L Management', 'Vision Setting', 'Organization Design']
    },
    phases: {
      junior: [
        { name: 'Product Fundamentals', weeks: 5, skills: ['Product Strategy', 'User Research'] },
        { name: 'Analytics & Data', weeks: 6, skills: ['Data Analysis', 'A/B Testing'] },
        { name: 'Execution', weeks: 5, skills: ['Roadmapping', 'Stakeholder Management'] }
      ],
      mid: [
        { name: 'Growth & Strategy', weeks: 6, skills: ['Growth Strategy', 'Pricing'] },
        { name: 'Go-to-Market', weeks: 5, skills: ['Go-to-Market', 'Marketing'] },
        { name: 'Leadership', weeks: 5, skills: ['Team Leadership', 'Cross-functional'] }
      ],
      senior: [
        { name: 'Executive Strategy', weeks: 6, skills: ['Executive Strategy', 'Vision'] },
        { name: 'Business Management', weeks: 5, skills: ['P&L Management', 'Finance'] },
        { name: 'Organization', weeks: 5, skills: ['Organization Design', 'Culture'] }
      ]
    }
  },
  'devops-engineer': {
    skills: {
      junior: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git', 'Bash', 'Monitoring'],
      mid: ['Terraform', 'Ansible', 'Security', 'Performance', 'Multi-cloud', 'Service Mesh'],
      senior: ['Architecture', 'Team Leadership', 'Strategy', 'Cost Optimization', 'Disaster Recovery']
    },
    phases: {
      junior: [
        { name: 'Infrastructure Basics', weeks: 6, skills: ['Linux', 'AWS', 'Bash'] },
        { name: 'Containerization', weeks: 6, skills: ['Docker', 'Kubernetes'] },
        { name: 'Automation', weeks: 6, skills: ['CI/CD', 'Monitoring'] }
      ],
      mid: [
        { name: 'Infrastructure as Code', weeks: 6, skills: ['Terraform', 'Ansible'] },
        { name: 'Security & Performance', weeks: 5, skills: ['Security', 'Performance'] },
        { name: 'Advanced Platforms', weeks: 5, skills: ['Service Mesh', 'Multi-cloud'] }
      ],
      senior: [
        { name: 'Architecture', weeks: 6, skills: ['Architecture', 'Strategy'] },
        { name: 'Leadership', weeks: 5, skills: ['Team Leadership', 'Mentoring'] },
        { name: 'Business', weeks: 5, skills: ['Cost Optimization', 'Disaster Recovery'] }
      ]
    }
  },
  'ux-designer': {
    skills: {
      junior: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'User Testing', 'Information Architecture'],
      mid: ['Design Systems', 'Advanced Prototyping', 'Service Design', 'Design Leadership', 'Analytics'],
      senior: ['Design Strategy', 'Team Leadership', 'Business Strategy', 'Innovation', 'Organizational Design']
    },
    phases: {
      junior: [
        { name: 'Research Fundamentals', weeks: 5, skills: ['User Research', 'User Testing'] },
        { name: 'Design & Prototyping', weeks: 6, skills: ['Wireframing', 'Prototyping', 'Figma'] },
        { name: 'Information Architecture', weeks: 5, skills: ['Information Architecture', 'Usability'] }
      ],
      mid: [
        { name: 'Design Systems', weeks: 6, skills: ['Design Systems', 'Component Design'] },
        { name: 'Advanced Design', weeks: 5, skills: ['Service Design', 'Advanced Prototyping'] },
        { name: 'Leadership', weeks: 5, skills: ['Design Leadership', 'Team Collaboration'] }
      ],
      senior: [
        { name: 'Strategy', weeks: 6, skills: ['Design Strategy', 'Business Strategy'] },
        { name: 'Leadership', weeks: 5, skills: ['Team Leadership', 'Mentoring'] },
        { name: 'Innovation', weeks: 5, skills: ['Innovation', 'Organizational Design'] }
      ]
    }
  },
  'data-engineer': {
    skills: {
      junior: ['Python', 'SQL', 'ETL', 'Data Warehousing', 'Apache Spark', 'AWS', 'Data Modeling'],
      mid: ['Apache Kafka', 'Stream Processing', 'Data Lakes', 'Snowflake', 'dbt', 'Orchestration'],
      senior: ['Data Architecture', 'Team Leadership', 'Data Governance', 'Performance Optimization', 'Strategy']
    },
    phases: {
      junior: [
        { name: 'Data Fundamentals', weeks: 6, skills: ['SQL', 'Python', 'Data Modeling'] },
        { name: 'ETL & Warehousing', weeks: 6, skills: ['ETL', 'Data Warehousing', 'AWS'] },
        { name: 'Big Data', weeks: 6, skills: ['Apache Spark', 'Distributed Computing'] }
      ],
      mid: [
        { name: 'Streaming & Real-time', weeks: 6, skills: ['Apache Kafka', 'Stream Processing'] },
        { name: 'Modern Data Stack', weeks: 5, skills: ['Snowflake', 'dbt', 'Data Lakes'] },
        { name: 'Orchestration', weeks: 5, skills: ['Airflow', 'Orchestration', 'Monitoring'] }
      ],
      senior: [
        { name: 'Architecture', weeks: 6, skills: ['Data Architecture', 'System Design'] },
        { name: 'Leadership', weeks: 5, skills: ['Team Leadership', 'Mentoring'] },
        { name: 'Governance & Strategy', weeks: 5, skills: ['Data Governance', 'Strategy'] }
      ]
    }
  }
};

// Generate learning path JSON
function generateLearningPath(role, experience, priority, timeCommitment) {
  const roleData = LEARNING_PATHS[role];
  const skills = roleData.skills[experience] || [];
  const phases = roleData.phases[experience] || [];
  
  const baseWeeks = experience === 'junior' ? 18 : experience === 'mid' ? 16 : 14;
  const timeMultiplier = timeCommitment === 'part-time' ? 1.5 : 1;
  const totalWeeks = Math.round(baseWeeks * timeMultiplier);
  
  const difficulty = experience === 'junior' ? 'Beginner' : experience === 'mid' ? 'Intermediate' : 'Advanced';
  
  return {
    role,
    experience,
    priority,
    timeCommitment,
    title: `${ROLES[role]} ${experience.charAt(0).toUpperCase() + experience.slice(1)} - ${priority.charAt(0).toUpperCase() + priority.slice(1)} Focus (${timeCommitment === 'part-time' ? 'Part Time' : 'Full Time'})`,
    description: `Comprehensive ${ROLES[role].toLowerCase()} training for ${experience} level professionals`,
    difficulty,
    duration_weeks: totalWeeks,
    skills: skills,
    phases: phases.map(phase => ({
      ...phase,
      duration_weeks: Math.round(phase.weeks * timeMultiplier)
    })),
    career_outcomes: [
      `${experience.charAt(0).toUpperCase() + experience.slice(1)} ${ROLES[role]}`,
      `${ROLES[role]} ${experience === 'junior' ? 'I' : experience === 'mid' ? 'II' : 'III'}`
    ]
  };
}

// Generate all files
function generateAllFiles() {
  let generated = 0;
  let errors = 0;
  
  for (const [roleKey, roleName] of Object.entries(ROLES)) {
    const roleDir = path.join(BASE_PATH, roleKey);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(roleDir)) {
      fs.mkdirSync(roleDir, { recursive: true });
    }
    
    for (const experience of EXPERIENCES) {
      for (const priority of PRIORITIES) {
        for (const timeCommitment of TIME_COMMITMENTS) {
          const filename = `${experience}_${priority}_${timeCommitment}.json`;
          const filepath = path.join(roleDir, filename);
          
          try {
            const learningPath = generateLearningPath(roleKey, experience, priority, timeCommitment);
            fs.writeFileSync(filepath, JSON.stringify(learningPath, null, 2));
            console.log(`✅ Generated: ${roleKey}/${filename}`);
            generated++;
          } catch (error) {
            console.error(`❌ Error generating ${roleKey}/${filename}:`, error.message);
            errors++;
          }
        }
      }
    }
  }
  
  console.log(`\n📊 Summary: ${generated} files generated, ${errors} errors`);
  console.log(`📁 Total expected: ${Object.keys(ROLES).length * EXPERIENCES.length * PRIORITIES.length * TIME_COMMITMENTS.length} files`);
}

// Run the generation
if (require.main === module) {
  console.log('🚀 Generating comprehensive learning path JSON files...\n');
  generateAllFiles();
}

module.exports = { generateAllFiles, generateLearningPath };