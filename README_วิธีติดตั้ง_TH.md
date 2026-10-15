# ชุดไฟล์ 21K List Live

ไฟล์ใน ZIP นี้: `index.html` (เว็บไซต์), `config.js` (ใส่ URL Worker), `21k-live-worker.js` (ตัวเชื่อม JSONBin และรับคำขอเพลง), และคู่มือนี้

## QR ใช้งานไม่ได้?

แก้ไว้แล้ว: หน้าเว็บส่งรหัสโชว์เป็น `?id=...` ให้ Worker เหมือนกันแล้ว ถ้า Worker ตั้งค่าถูกต้อง QR จะสร้างได้หลังจากกดปุ่มแชร์

## ตั้งค่าเว็บไซต์

1. ใส่ URL Cloudflare Worker จริงใน `config.js` แทนข้อความ `ใส่_URL_WORKER_ของคุณ_ตรงนี้` (ไม่ต้องใส่ `/show` ต่อท้าย)
2. อัปโหลด `index.html` และ `config.js` ไปไว้ในโฟลเดอร์เดียวกันบน GitHub Pages
3. อย่าอัปโหลดกุญแจ JSONBin หรือรหัสลับลง GitHub

## ตั้งค่า Worker

ใช้ `21k-live-worker.js` ใน Cloudflare Worker ตัวเดิม และตั้งค่าที่ Worker → Settings → Variables and Secrets:
- `JSONBIN_BIN_ID`: Text, Bin ID ที่มีข้อมูล JSON แบบ object
- `JSONBIN_MASTER_KEY`: Secret, Master Key ใน JSONBin
- `OWNER_TOKEN`: Secret, รหัสที่เจ้าของจะกรอกในหน้าเว็บตอนเริ่ม Live

กด Deploy หลังเปลี่ยนโค้ดหรือตั้งค่า การรับคำขอเพลงจากเพื่อนจะเก็บไว้ในรายการของโชว์และแสดงที่หน้า Live เจ้าของ

## ทดลอง

เพิ่มเพลงเข้า Playlist → เปิดหน้า Live → กด QR → กรอกรหัสเจ้าของ → QR ควรปรากฏ จากนั้นสแกน QR จากโทรศัพท์อีกเครื่องแล้วลองส่งคำขอเพลง

ค่า URL, Bin ID และรหัสจริงไม่ได้รวมในชุดนี้ ต้องใช้ค่าจากบัญชี Cloudflare/JSONBin ของคุณ
