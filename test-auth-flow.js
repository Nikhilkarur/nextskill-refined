/**
 * Test script to debug the auth flow issue
 * Tests signup -> questionnaire -> roadmap -> signin -> redirect flow
 */

const BASE_URL = 'http://127.0.0.1:8080';
const TEST_EMAIL = 'test-user-' + Date.now() + '@example.com';
const TEST_PASSWORD = 'TestPass123';

async function makeRequest(path, options = {}) {
    const url = path.startsWith('http') ? path : BASE_URL + path;
    console.log(`🌐 ${options.method || 'GET'} ${url}`);
    
    const headers = {
        ...options.headers
    };
    
    // Only add Content-Type for requests with body
    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    const responseText = await response.text();
    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = responseText;
    }
    
    console.log(`📋 Status: ${response.status}, Response:`, responseData);
    return { status: response.status, data: responseData };
}

async function testCompleteFlow() {
    console.log('🚀 Starting complete auth flow test...\n');
    
    try {
        // 1. Sign up
        console.log('1️⃣ Testing SIGNUP...');
        const signupResponse = await makeRequest('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });
        
        if (signupResponse.status !== 200 || !signupResponse.data.token) {
            throw new Error('Signup failed: ' + JSON.stringify(signupResponse.data));
        }
        
        const token = signupResponse.data.token;
        console.log('✅ Signup successful, token received\n');
        
        // 2. Test dashboard (should redirect to questions for new user)
        console.log('2️⃣ Testing DASHBOARD (new user)...');
        const dashboardResponse1 = await makeRequest('/api/users/dashboard', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Dashboard response for new user:', dashboardResponse1.data);
        console.log('🔍 RedirectTo:', dashboardResponse1.data?.redirectTo, '\n');
        
        // 3. Submit questionnaire
        console.log('3️⃣ Testing QUESTIONNAIRE SUBMISSION...');
        const questionnaireResponse = await makeRequest('/api/questions/submit', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                answers: [
                    { questionId: 1, answer: 'Frontend Developer' },
                    { questionId: 2, answer: 'Intermediate' },
                    { questionId: 3, answer: 'React' },
                    { questionId: 4, answer: '2-3 hours/week' }
                ]
            })
        });
        
        console.log('✅ Questionnaire submitted:', questionnaireResponse.data, '\n');
        
        // 4. Generate roadmap
        console.log('4️⃣ Testing ROADMAP GENERATION...');
        const roadmapResponse = await makeRequest('/api/roadmaps/generate', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                role: 'Frontend Developer',
                experience: 'Intermediate',
                priority: 'React',
                timeCommitment: '2-3 hours/week'
            })
        });
        
        console.log('✅ Roadmap generated:', roadmapResponse.status === 200 ? 'Success' : 'Failed');
        if (roadmapResponse.status !== 200) {
            console.log('❌ Roadmap generation failed:', roadmapResponse.data);
        }
        console.log('');
        
        // 5. Test dashboard again (should now redirect to roadmap)
        console.log('5️⃣ Testing DASHBOARD (after roadmap creation)...');
        const dashboardResponse2 = await makeRequest('/api/users/dashboard', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Dashboard response after roadmap:', dashboardResponse2.data);
        console.log('🔍 RedirectTo:', dashboardResponse2.data?.redirectTo);
        console.log('🔍 Total Roadmaps:', dashboardResponse2.data?.totalRoadmaps);
        console.log('🔍 Latest Roadmap:', dashboardResponse2.data?.latestRoadmap);
        console.log('');
        
        // 6. Test sign in again (simulate browser refresh/new session)
        console.log('6️⃣ Testing SIGNIN (returning user)...');
        const signinResponse = await makeRequest('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });
        
        if (signinResponse.status !== 200 || !signinResponse.data.token) {
            throw new Error('Signin failed: ' + JSON.stringify(signinResponse.data));
        }
        
        const newToken = signinResponse.data.token;
        console.log('✅ Signin successful, new token received\n');
        
        // 7. Test dashboard with new token (should redirect to roadmap)
        console.log('7️⃣ Testing DASHBOARD (returning user)...');
        const dashboardResponse3 = await makeRequest('/api/users/dashboard', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${newToken}` }
        });
        
        console.log('✅ Dashboard response for returning user:', dashboardResponse3.data);
        console.log('🔍 RedirectTo:', dashboardResponse3.data?.redirectTo);
        console.log('🔍 Should be "roadmap" for returning user with roadmaps');
        
        // Final summary
        console.log('\n🎯 SUMMARY:');
        console.log('New user redirect:', dashboardResponse1.data?.redirectTo);
        console.log('After roadmap redirect:', dashboardResponse2.data?.redirectTo);
        console.log('Returning user redirect:', dashboardResponse3.data?.redirectTo);
        
        if (dashboardResponse3.data?.redirectTo === 'roadmap') {
            console.log('✅ SUCCESS: Smart redirect is working correctly!');
        } else {
            console.log('❌ PROBLEM: Returning user should redirect to roadmap, but got:', dashboardResponse3.data?.redirectTo);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
testCompleteFlow();