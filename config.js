// ==========================================
// ⚙️ config.js (แก้ไขให้ตรงกับ DB ของคุณ)
// ==========================================
const TAS_CONFIG = {
    // ⚠️ ใส่ KEY ANON (Public) ของคุณที่นี่
    SUPABASE_URL: "https://tdcmbskmlrwhbjrjyjkk.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY21ic2ttbHJ3aGJqcmp5amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTY4NTYsImV4cCI6MjA3ODE5Mjg1Nn0.FeYe75J8X_2LoQgG_JWyPNCKcuCL_otsmSW0s5bijAg", 
    
     // ชื่อตาราง (ต้องมีครบทั้ง 4 ตัว)
    TABLE_USER: "Personnel",        // ตารางพนักงาน
    TABLE_SETTINGS: "Settings",     // ตารางตั้งค่า URL
    
    // 🔥 ที่ Error เพราะขาดบรรทัดนี้ครับ
    TABLE_SOURCE: "TimeStampPlus",  // ตารางต้นทาง (จากเว็บ)
    
    TABLE_TARGET: "TimeStamp"       // ตารางปลายทาง (ผลลัพธ์)
};

// ==========================================
// 🔧 ระบบส่วนกลาง (ไม่ต้องแก้)
// ==========================================
let sbClient = null;

function initSystem() {
    if (typeof window.supabase === 'undefined' || typeof Swal === 'undefined') {
        alert("❌ ไม่พบไฟล์ supabase.js หรือ sweetalert2.js");
        return false;
    }
    sbClient = window.supabase.createClient(TAS_CONFIG.SUPABASE_URL, TAS_CONFIG.SUPABASE_KEY);
    return true;
}

function checkAuth() {
    const stored = localStorage.getItem('tas_user');
    if (!stored) { window.location.href = 'login.html'; return null; }
    const user = JSON.parse(stored);
    // เช็ค Level 1 (แปลงเป็น String กันเหนียว)
    if (String(user.level) !== '1') {
        alert("⛔ Access Denied (Level 1 Only)");
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function logout() {
    Swal.fire({
        title: 'ออกจากระบบ?', icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#ef4444', confirmButtonText: 'ยืนยัน'
    }).then((r) => {
        if (r.isConfirmed) {
            localStorage.removeItem('tas_user');
            window.location.href = 'login.html';
        }
    });
}

function generateID() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const r = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${r}`;
}

// เริ่มระบบทันที
initSystem();
