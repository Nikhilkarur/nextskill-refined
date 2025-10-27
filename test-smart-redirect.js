#!/usr/bin/env node

/**
 * Test script to verify the smart user redirect functionality
 * Tests both new user flow and existing user flow
 */

const http = require('http');

const BASE_URL = 'http://localhost:8080';

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, headers: res.headers, body: response });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, body: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testSmartRedirect() {
    console.log('🚀 Testing NextSkill Smart Redirect Functionality\n');

    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';

    try {
        // Test 1: Create new user
        console.log('📝 Test 1: Creating new user...');
        const signupResponse = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/auth/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            email: testEmail,
            password: testPassword
        });

        if (signupResponse.status === 200 && signupResponse.body.token) {
            console.log('✅ User created successfully');
            console.log(`   Token: ${signupResponse.body.token.substring(0, 20)}...`);
        } else {
            console.log('❌ Failed to create user');
            console.log('   Response:', signupResponse);
            return;
        }

        const token = signupResponse.body.token;

        // Test 2: Check dashboard for new user (should redirect to questions)
        console.log('\n📊 Test 2: Checking dashboard for new user...');
        const dashboardResponse1 = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/users/dashboard',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (dashboardResponse1.status === 200) {
            console.log('✅ Dashboard endpoint working');
            console.log(`   Has completed questionnaire: ${dashboardResponse1.body.hasCompletedQuestionnaire}`);
            console.log(`   Redirect to: ${dashboardResponse1.body.redirectTo}`);
            console.log(`   Total roadmaps: ${dashboardResponse1.body.totalRoadmaps}`);

            if (dashboardResponse1.body.redirectTo === 'questions') {
                console.log('✅ New user correctly redirected to questions');
            } else {
                console.log('❌ New user should be redirected to questions');
            }
        } else {
            console.log('❌ Dashboard endpoint failed');
            console.log('   Response:', dashboardResponse1);
            return;
        }

        // Test 3: Submit questionnaire for user
        console.log('\n📋 Test 3: Submitting questionnaire...');
        const questionnaireResponse = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/questions/submit',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }, {
            role: 'Software Engineer',
            experience: 'mid',
            priority: 'technical-skills',
            timeCommitment: '10-hours',
            resumeText: 'Test resume content'
        });

        if (questionnaireResponse.status === 200) {
            console.log('✅ Questionnaire submitted successfully');
            console.log(`   Questionnaire ID: ${questionnaireResponse.body}`);
        } else {
            console.log('❌ Failed to submit questionnaire');
            console.log('   Response:', questionnaireResponse);
            return;
        }

        // Test 4: Generate roadmap
        console.log('\n🗺️ Test 4: Generating roadmap...');
        const roadmapResponse = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/roadmaps/generate',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }, {
            role: 'Software Engineer',
            experience: 'mid',
            priority: 'technical-skills',
            timeCommitment: '10-hours',
            forceGenerate: true
        });

        if (roadmapResponse.status === 200) {
            console.log('✅ Roadmap generated successfully');
            console.log(`   Roadmap ID: ${roadmapResponse.body.roadmapId || 'Generated'}`);
        } else {
            console.log('❌ Failed to generate roadmap');
            console.log('   Response:', roadmapResponse);
        }

        // Test 5: Check dashboard for existing user (should redirect to roadmap)
        console.log('\n📊 Test 5: Checking dashboard for existing user...');
        const dashboardResponse2 = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/users/dashboard',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (dashboardResponse2.status === 200) {
            console.log('✅ Dashboard endpoint working for existing user');
            console.log(`   Has completed questionnaire: ${dashboardResponse2.body.hasCompletedQuestionnaire}`);
            console.log(`   Redirect to: ${dashboardResponse2.body.redirectTo}`);
            console.log(`   Total roadmaps: ${dashboardResponse2.body.totalRoadmaps}`);

            if (dashboardResponse2.body.redirectTo === 'roadmap') {
                console.log('✅ Existing user correctly redirected to roadmap');
            } else {
                console.log('❌ Existing user should be redirected to roadmap');
            }

            if (dashboardResponse2.body.latestRoadmap) {
                console.log(`   Latest roadmap role: ${dashboardResponse2.body.latestRoadmap.role}`);
                console.log(`   Latest roadmap experience: ${dashboardResponse2.body.latestRoadmap.experience}`);
            }
        } else {
            console.log('❌ Dashboard endpoint failed for existing user');
            console.log('   Response:', dashboardResponse2);
        }

        console.log('\n🎉 Smart redirect test completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testSmartRedirect();