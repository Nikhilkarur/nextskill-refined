# 🧪 NextSkill Manual Testing Guide

## ✅ **AUTOMATED TESTS PASSED**
- ✅ Backend: Running and healthy
- ✅ Frontend: All 5 pages accessible  
- ✅ Authentication: Clean version (no debug clutter)
- ✅ Learning Resources: YouTube videos working
- ✅ APIs: Responding correctly

---

## 🎯 **MANUAL TESTING STEPS**

### **Step 1: Fresh Start**
1. **Clear browser data**: Press F12 → Application → Storage → Clear Site Data
2. **Start here**: http://127.0.0.1:5500/frontend/index.html

### **Step 2: Test Landing Page**
✅ **Check**: 
- Page loads quickly and looks professional
- "Answer Questions" → "Upload Resume" → "Get Roadmap" steps visible
- "Get Started" button present and clickable

### **Step 3: Test Authentication (CRITICAL)**
1. **Click "Get Started"** → Should go to auth page
2. **Verify clean interface**: No debug panels, status indicators, or loading messages
3. **Create new account**:
   - Use unique email: `test-[timestamp]@example.com`
   - Use any password
   - Click "Create Account"
4. **Expected**: Should redirect to questions page

### **Step 4: Test Questionnaire Flow**
1. **Select role**: Try "Product Manager" 
2. **Choose experience**: "Junior"
3. **Select focus**: "Skills Focus"
4. **Choose time**: "Full-time"
5. **Click "Generate My Roadmap"**
6. **Expected**: Should generate roadmap specific to Product Manager

### **Step 5: Test Learning Dashboard**
1. **From roadmap, click "Start Learning Journey"**
2. **Navigate to "Resources" tab**
3. **Click any video link** (e.g., "JavaScript Crash Course")
4. **Expected**: Should open YouTube in new tab

### **Step 6: Test Different Roles**
1. **Go back to questions** (clear localStorage to start fresh)
2. **Try "Data Scientist"** → Should show Python, ML content
3. **Try "UX Designer"** → Should show design-specific content

---

## 🎯 **WHAT TO LOOK FOR**

### **✅ GOOD SIGNS**
- Auth page loads immediately (no debug clutter)
- Account creation works smoothly
- Role-specific roadmaps generate correctly
- Video links open YouTube tutorials
- Navigation between pages is smooth

### **❌ RED FLAGS**
- Debug status panels on auth page
- Video links don't open or show "#"
- Roadmaps show wrong content for selected role
- Auto-redirect issues on auth page
- Error messages that mention system internals

---

## 🚀 **QUICK TEST (2 MINUTES)**

1. **Open**: http://127.0.0.1:5500/frontend/index.html
2. **Click**: "Get Started"
3. **Create account**: `quicktest@example.com` / `password123`
4. **Complete questionnaire**: Product Manager → Junior → Skills → Full-time
5. **Click**: "Start Learning Journey" → Resources → Any video
6. **Expected**: YouTube tutorial opens

---

## 📱 **TEST LINKS**

### **Direct Access**:
- 🏠 **Landing**: http://127.0.0.1:5500/frontend/index.html
- 🔐 **Auth**: http://127.0.0.1:5500/frontend/auth.html
- 📝 **Questions**: http://127.0.0.1:5500/frontend/questions.html
- 🗺️ **Roadmap**: http://127.0.0.1:5500/frontend/roadmap.html
- 📚 **Learning**: http://127.0.0.1:5500/frontend/learning.html

### **Debug Tools**:
- 🧹 **Clear Data**: http://127.0.0.1:5500/frontend/clear-data.html (use this to reset localStorage/sessionStorage before tests)

---

## 🎊 **SUCCESS CRITERIA**

Your platform passes if:
1. ✅ **Authentication works without debug clutter**
2. ✅ **Video links open real YouTube tutorials**
3. ✅ **Role-specific roadmaps generate correctly**
4. ✅ **Complete user flow works smoothly**
5. ✅ **No confusing error messages or auto-redirects**

---

**Ready to test! Let me know what you find!** 🚀