// ==========================================
// ส่วนตั้งค่าระบบ (Configuration)
// ==========================================
const CONFIG = {
    appName: "TAS-SPB System",
    version: "1.0.0",
    apiBaseUrl: "https://api.example.com", // ตัวอย่าง URL API
    themeColor: "#4F46E5"
};

// ==========================================
// ส่วนจัดการสิทธิ์การเข้าถึง (Access Control Logic)
// ==========================================

// ฟังก์ชันดึงระดับผู้ใช้งานจาก LocalStorage
function getUserLevel() {
    try {
        // ดึงข้อมูลจาก localStorage (รองรับทั้ง key 'user_data' และ 'user')
        const userStr = localStorage.getItem('user_data') || localStorage.getItem('user');
        
        if (!userStr) return 0; // ไม่พบข้อมูล = ระดับ 0

        const user = JSON.parse(userStr);
        // แปลงเป็นตัวเลข ถ้าไม่มีให้เป็น 0
        return parseInt(user.level || user.role || 0); 
    } catch (e) {
        console.error("Error parsing user data:", e);
        return 0; // กรณี error ให้เป็นระดับต่ำสุด
    }
}

// ฟังก์ชันตรวจสอบสิทธิ์ก่อนเข้าหน้าเว็บ
// allowedLevels: อาร์เรย์ของ level ที่อนุญาตให้เข้าได้ เช่น [1] หรือ [1, 2]
function checkAuth(allowedLevels) {
    const userLevel = getUserLevel();

    // ถ้า allowedLevels เป็น '*' คือเข้าได้ทุกคน
    if (allowedLevels === '*') return;

    // ตรวจสอบว่า userLevel ปัจจุบัน อยู่ในรายการที่อนุญาตหรือไม่
    if (!allowedLevels.includes(userLevel)) {
        // ใช้ SweetAlert2 ถ้ามี หรือใช้ alert ธรรมดา
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'ไม่มีสิทธิ์เข้าถึง',
                text: 'ระดับบัญชีของคุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้',
                confirmButtonText: 'กลับหน้าเมนู',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'menu.html';
                }
            });
        } else {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            window.location.href = 'menu.html';
        }
    }
}

// ฟังก์ชันสำหรับซ่อน/แสดงปุ่มในหน้า Menu ตามระดับ
function applyMenuVisibility() {
    const userLevel = getUserLevel();
    console.log("Current User Level:", userLevel);

    // รายชื่อ ID ของปุ่มเมนูต่างๆ
    const btnSettings = document.getElementById('menu-settings'); // Admin Tools
    const btnProcess = document.getElementById('menu-process');   // ประมวลผล
    const btnReport = document.getElementById('menu-report');     // รายงาน
    // โปรไฟล์ (menu-profile) แสดงตลอด ไม่ต้องซ่อน

    // กฎการแสดงผล
    
    // Level 2: ไม่เห็น Settings
    if (userLevel === 2) {
        if (btnSettings) btnSettings.style.display = 'none';
    }

    // Level อื่นๆ (0 หรือ Unspecified): เห็นแค่ Profile (ซ่อน Process, Report, Settings)
    if (userLevel !== 1 && userLevel !== 2) {
        if (btnSettings) btnSettings.style.display = 'none';
        if (btnProcess) btnProcess.style.display = 'none';
        if (btnReport) btnReport.style.display = 'none';
    }
}
