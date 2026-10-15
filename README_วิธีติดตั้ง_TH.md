# ชุดไฟล์ 21K List Live

ไฟล์ใน ZIP นี้: `index.html` (เว็บไซต์), `config.js` (URL Worker), `21k-live-worker.js` (ตัวเชื่อม JSONBin, Live และคลังเพลง), และคู่มือนี้

## QR ใช้งานไม่ได้?

แก้ไว้แล้ว: หน้าเว็บส่งรหัสโชว์เป็น `?id=...` ให้ Worker เหมือนกันแล้ว ถ้า Worker ตั้งค่าถูกต้อง QR จะสร้างได้หลังจากกดปุ่มแชร์

## ตั้งค่าเว็บไซต์

1. ในชุดนี้ใส่ URL Worker `https://21k-list-sync.zieawlovepanda.workers.dev` ให้แล้ว (ไม่ต้องเติม `/show` ต่อท้าย)
2. อัปโหลด `index.html` และ `config.js` ไปไว้ในโฟลเดอร์เดียวกันบน GitHub Pages
3. อย่าอัปโหลดกุญแจ JSONBin หรือรหัสลับลง GitHub

## ตั้งค่า Worker

ใช้ `21k-live-worker.js` ใน Cloudflare Worker ตัวเดิม และตั้งค่าที่ Worker → Settings → Variables and Secrets:
- `JSONBIN_BIN_ID`: Text, Bin ID ที่มีข้อมูล JSON แบบ object
- `JSONBIN_MASTER_KEY`: Secret, Master Key ใน JSONBin
- `OWNER_TOKEN`: Secret, รหัสที่เจ้าของจะกรอกในหน้าเว็บตอนเริ่ม Live

กด Deploy หลังเปลี่ยนโค้ดหรือตั้งค่า การรับคำขอเพลงจากเพื่อนจะเก็บไว้ในรายการของโชว์และแสดงที่หน้า Live เจ้าของ

## ซิงก์คลังเพลงระหว่าง MacBook และ iPad

อัปเดตทั้ง `index.html` บน GitHub Pages และ `21k-live-worker.js` ใน Worker ก่อน จากนั้นเปิดเว็บบนแต่ละเครื่องและกรอกรหัสควบคุมเดียวกันครั้งแรก ระบบจะรวมเพลงที่มีอยู่ทั้งสองเครื่องเข้าคลังส่วนกลาง แล้วซิงก์การเพิ่ม แก้ไข และลบเพลงอัตโนมัติ ปุ่ม **☁️ ซิงก์คลังเพลง** ใช้เริ่มซิงก์หรือสั่งซิงก์ใหม่ได้ สถานะจะแสดงข้างปุ่ม

ถ้ารหัสควบคุมที่ใช้กับ Worker เดิมถูกต้อง ไม่ต้องสร้าง Secret ใหม่ เพียงอัปเดตโค้ด Worker แล้ว Deploy

## ทดลอง

เพิ่มเพลงเข้า Playlist → เปิดหน้า Live → กด QR → กรอกรหัสควบคุมในช่องบนหน้าเว็บ → QR ควรปรากฏ จากนั้นสแกน QR จากโทรศัพท์อีกเครื่องแล้วลองส่งคำขอเพลง

URL Worker ตั้งค่าไว้แล้ว แต่ Bin ID, Master Key และรหัสควบคุมจริงต้องมาจากบัญชี Cloudflare/JSONBin ของคุณ
