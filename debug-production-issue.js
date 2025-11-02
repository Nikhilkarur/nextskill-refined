/**
 * Isolated test to replicate the production 500 error
 */

const BASE_URL = 'http://127.0.0.1:8080';

async function testProductionIssue() {
    console.log('🔬 Testing Production Issue Replication...\n');
    
    try {
        // 1. Create user
        const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'production-test-' + Date.now() + '@example.com',
                password: 'TestPass123'
            })
        });
        
        const signupData = await signupResponse.json();
        const token = signupData.token;
        console.log('✅ User created');
        
        // 2. Generate roadmap directly (like production)
        const roadmapResponse = await fetch(`${BASE_URL}/api/roadmaps/generate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                role: 'Frontend Developer',
                experience: 'Intermediate', 
                priority: 'React',
                timeCommitment: '2-3 hours/week'
            })
        });
        
        console.log('✅ Roadmap generation status:', roadmapResponse.status);
        
        // 3. Test dashboard immediately after roadmap
        console.log('🔍 Testing dashboard with roadmap...');
        const dashboardResponse = await fetch(`${BASE_URL}/api/users/dashboard`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('📊 Dashboard status:', dashboardResponse.status);
        
        if (dashboardResponse.ok) {
            const data = await dashboardResponse.json();
            console.log('✅ Dashboard response:', data);
        } else {
            const errorText = await dashboardResponse.text();
            console.log('❌ Dashboard error:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testProductionIssue();