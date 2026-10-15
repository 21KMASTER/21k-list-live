# คู่มือ 21K List แบบละเอียด สำหรับผู้เริ่มต้น

คู่มือนี้จะพาเปิดเว็บไซต์ 21K List บนอินเทอร์เน็ตและตั้งค่าซิงก์หน้า Live ข้ามมือถือ โดยทำทีละขั้น ไม่ต้องเขียนโค้ด แต่ต้องมีบัญชี GitHub, JSONBin.io และ Cloudflare (สมัครได้ฟรีตามเงื่อนไขของแต่ละบริการ)

> **สำคัญ:** การทำตามคู่มือจะเผยแพร่เว็บไซต์ให้คนทั่วไปเปิดได้ อย่าใส่รหัสผ่าน, JSONBin key หรือรหัสควบคุมในไฟล์ที่อัปโหลดไป GitHub คุณจะใส่ key เฉพาะในหน้าตั้งค่าลับของ Cloudflare

## ก่อนเริ่ม: เตรียมไฟล์และบัญชี

1. ดาวน์โหลดไฟล์ ZIP ที่ได้รับ
2. แตกไฟล์ ZIP ก่อนใช้งาน:
   - Mac: ดับเบิลคลิกไฟล์ ZIP
   - Windows: คลิกขวา ZIP แล้วเลือก **Extract All… / แยกไฟล์ทั้งหมด**
3. เปิดโฟลเดอร์ `21k-list-live-project` ที่แตกออกมา คุณควรเห็นไฟล์ 4 ไฟล์: `index.html`, `config.js`, `worker.js`, `README_TH.md`
4. สร้าง/ลงชื่อเข้าใช้บัญชีที่ [GitHub](https://github.com), [JSONBin](https://jsonbin.io) และ [Cloudflare](https://dash.cloudflare.com)

**อย่าอัปโหลดไฟล์ ZIP เข้า GitHub โดยตรง** GitHub Pages ต้องเห็น `index.html` และ `config.js` อยู่ในโฟลเดอร์เว็บไซต์ชั้นบนสุดของ Repository

## ขั้นที่ 1: สร้างที่เก็บข้อมูลใน JSONBin

Bin คือกล่องเก็บข้อมูลหนึ่งกล่อง เราจะใช้เพียงกล่องเดียวสำหรับสถานะโชว์ปัจจุบัน

1. เปิด [หน้า JSONBin](https://jsonbin.io) แล้วลงชื่อเข้าใช้
2. เปิดหน้า Dashboard แล้วเลือกสร้าง Bin ใหม่ (ปุ่มอาจเขียนว่า **Create Bin** หรือ **New Bin**)
3. ในช่องข้อมูล JSON วางข้อความนี้ให้ครบ รวมปีกกาและเครื่องหมายคำพูด:

   ```json
   {"showId":"","playlist":[],"currentIndex":0,"updatedAt":0}
   ```

4. ถ้ามีตัวเลือก Private/Public ให้เลือก **Private**. ถ้าไม่มีตัวเลือก ให้ตรวจหลังสร้างว่า Bin แสดงสถานะ Private
5. ตั้งชื่อจำง่าย เช่น `21K Live Show` ถ้ามีช่องชื่อ
6. กด **Create / Save**
7. จด **Bin ID** ที่แสดงหลังสร้างไว้ชั่วคราวในที่ส่วนตัว ห้ามโพสต์ให้คนอื่น

### สร้าง Access Key สำหรับ Bin

Access Key เป็นกุญแจที่จำกัดสิทธิ์ได้ ปลอดภัยกว่าใช้ Master Key หลัก

1. ใน JSONBin เปิดเมนู **API Keys** หรือ **Access Keys**
2. เลือก **Create Access Key**
3. ตั้งชื่อ เช่น `21K Live Worker`
4. เลือกสิทธิ์สำหรับ Bins เป็น **Read** และ **Update** เท่านั้น ถ้ามีตัวเลือก **Create** หรือ **Delete** ให้ปิด
5. สร้าง key แล้วคัดลอกค่าทันทีเก็บไว้ในที่ส่วนตัว หน้านี้อาจแสดงค่าให้เห็นเพียงครั้งเดียว
6. อย่าส่ง Access Key หรือ Master Key มาทางแชต และอย่าวางใน `index.html` หรือ `config.js`

ถ้าหน้าสร้าง Access Key ไม่มีสิทธิ์ Read/Update หรือไม่สามารถอ่าน Bin แบบ Private ได้ ให้หยุดก่อน อย่าเปลี่ยน Bin เป็น Public เพื่อแก้ปัญหา ให้ตรวจคู่มือ JSONBin หรือแจ้งข้อความผิดพลาดที่เห็น (แต่ไม่ส่ง key)

## ขั้นที่ 2: เผยแพร่หน้าเว็บด้วย GitHub Pages

1. เปิด [GitHub](https://github.com) แล้วกด **+** มุมขวาบน → **New repository**
2. ตั้งชื่อ Repository เป็น `21k-list-live` (แนะนำให้ใช้ชื่อนี้) เลือก **Public** แล้วกด **Create repository**
3. ในหน้า Repository กด **Add file → Upload files**
4. จากโฟลเดอร์ที่แตก ZIP ให้ลากไฟล์ `index.html`, `config.js`, `worker.js`, `README_TH.md` ลงหน้าอัปโหลดทีละชุดได้ ตรวจว่าไฟล์อยู่ที่ระดับบนสุด ไม่ได้อยู่ในโฟลเดอร์ซ้อนอีกชั้น
5. กด **Commit changes** เพื่อบันทึกไฟล์
6. เปิดแท็บ **Settings** ของ Repository → ด้านซ้ายเลือก **Pages**
7. ในส่วน **Build and deployment** เลือก **Deploy from a branch**
8. เลือก Branch เป็น `main` และโฟลเดอร์เป็น `/(root)` แล้วกด **Save**
9. รอให้ GitHub Pages แสดงลิงก์เว็บไซต์ โดยทั่วไปหน้าตาจะเป็น `https://ชื่อผู้ใช้.github.io/21k-list-live/`
10. จดลิงก์นี้ไว้ และเปิดทดสอบดูว่าเว็บโหลดได้ แม้ระบบ Live จะยังไม่เชื่อมจนกว่าจะทำขั้นตอนถัดไป

ชื่อผู้ใช้ GitHub คือชื่อที่แสดงในลิงก์ ไม่ใช่อีเมลของคุณ ตัวอย่างเช่น หากชื่อผู้ใช้ `somchai` ลิงก์จะเป็น `https://somchai.github.io/21k-list-live/`

## ขั้นที่ 3: สร้าง Cloudflare Worker สำหรับเก็บกุญแจอย่างปลอดภัย

Worker เป็นตัวกลางระหว่างหน้าเว็บกับ JSONBin หน้าสาธารณะจะไม่เห็น Access Key

1. เปิด [Cloudflare Dashboard](https://dash.cloudflare.com) แล้วลงชื่อเข้าใช้
2. เลือก **Workers & Pages** → **Create application** → สร้าง **Worker** ใหม่ (ชื่อปุ่มอาจต่างกันเล็กน้อย)
3. เริ่มจาก Worker เปล่าหรือ **Hello World** ตั้งชื่อเช่น `21k-list-sync` แล้วกด **Deploy**
4. เปิด Worker ที่สร้าง แล้วกด **Edit code**
5. เปิดไฟล์ `worker.js` จากโฟลเดอร์โปรเจกต์ คัดลอกเนื้อหาทั้งหมด แล้วแทนโค้ดตัวอย่างใน Cloudflare ด้วยเนื้อหานี้
6. กด **Deploy** หรือ **Save and deploy**
7. กลับหน้าตั้งค่า Worker → **Settings** → **Variables and Secrets** (บางหน้าจออาจเรียก **Environment Variables**) → **Add**
8. เพิ่มตัวแปรต่อไปนี้ทีละตัว:

   | ชื่อตัวแปร | สิ่งที่ใส่ | เลือก Secret? |
   |---|---|---|
   | `JSONBIN_BIN_ID` | Bin ID ที่จดจาก JSONBin | ไม่ต้อง |
   | `JSONBIN_ACCESS_KEY` | Access Key ที่สร้างไว้ | **เลือก Secret** |
   | `OWNER_TOKEN` | รหัสควบคุมที่คุณสร้างเอง ยาวอย่างน้อย 32 ตัวอักษร | **เลือก Secret** |
   | `ALLOWED_ORIGINS` | ต้นทาง GitHub Pages เช่น `https://somchai.github.io` | ไม่ต้อง |

   `ALLOWED_ORIGINS` ใช้เฉพาะส่วนต้นของลิงก์ก่อนชื่อ Repository ไม่ใส่ `/21k-list-live/` และไม่ใส่ `/` ปิดท้าย

9. รหัส `OWNER_TOKEN` ให้สร้างเองและเก็บเป็นความลับ เช่น สุ่มรหัสยาวจาก Password Manager อย่าใช้ตัวอย่างในคู่มือนี้เป็นรหัสจริง
10. บันทึก/Deploy การตั้งค่าอีกครั้ง
11. คัดลอก URL ของ Worker ที่ลงท้ายด้วย `.workers.dev` เช่น `https://21k-list-sync.username.workers.dev`

รายละเอียดตำแหน่งเมนู Cloudflare อาจเปลี่ยนได้ ดูคู่มือทางการ [สร้าง Worker ผ่าน Dashboard](https://developers.cloudflare.com/workers/get-started/dashboard/) และ [ตั้งค่า Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## ขั้นที่ 4: ใส่ URL ของ Worker ในเว็บไซต์

1. กลับไป GitHub Repository ของคุณ แล้วเปิดไฟล์ `config.js`
2. กดรูปดินสอ **Edit this file**
3. หา URL ตัวอย่าง `https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev`
4. แทนด้วย URL จริงที่คัดลอกจาก Cloudflare โดยคงเครื่องหมายคำพูดไว้ ตัวอย่าง:

   ```js
   window.APP_CONFIG = {
     syncApi: 'https://21k-list-sync.username.workers.dev'
   };
   ```

5. กด **Commit changes** เพื่อบันทึก
6. รอ 1–5 นาทีให้ GitHub Pages อัปเดต แล้วเปิดลิงก์เว็บไซต์ใหม่

ห้ามเปลี่ยนไฟล์ `config.js` เป็นที่ใส่ Bin ID, Access Key หรือ `OWNER_TOKEN` ไฟล์นี้เป็นสาธารณะ

## ขั้นที่ 5: ทดลองใช้งานจริง

1. เปิดเว็บไซต์บนคอมพิวเตอร์หรือโทรศัพท์ของเจ้าของ
2. เพิ่มเพลง/เลือก Playlist ตามปกติ แล้วเปิดหน้าจอ Live
3. กด **ลิงก์ QR Code ให้เพื่อนดูจอสด**
4. ครั้งแรกจะมีกล่องถามรหัส ให้กรอก `OWNER_TOKEN` ที่ตั้งไว้ใน Cloudflare แล้วกดตกลง
5. ถ้าสำเร็จ จะเห็น QR และลิงก์แชร์ ห้ามส่ง `OWNER_TOKEN` ให้เพื่อน ส่งเฉพาะ QR/ลิงก์ที่มี `?show=...`
6. ใช้โทรศัพท์อีกเครื่องสแกน QR โทรศัพท์นั้นควรเห็นหน้าจอ Live เท่านั้น ไม่มีคลังเพลงหรือปุ่มจัดการ
7. ที่เครื่องเจ้าของ กดเพลงถัดไป/ก่อนหน้า ผู้ชมควรเห็นเพลงเปลี่ยนภายในประมาณ 4 วินาที
8. ถ้าทดสอบผ่าน แปลว่าหน้าเว็บ, Worker และ JSONBin ติดต่อกันได้

การสร้าง QR ใหม่จะแทนที่สถานะโชว์เก่าที่เก็บใน Bin นี้ ใช้ได้ทีละหนึ่งโชว์

## ถ้าติดปัญหา

- **เว็บขึ้น 404:** ตรวจว่า `index.html` อยู่ระดับบนสุดของ Repository และ Pages เลือก `main` + `/(root)`
- **หน้าเว็บเปิด แต่สร้าง QR ไม่ได้และแจ้งให้ตั้งค่า Worker:** ตรวจ URL ใน `config.js` ว่าตรงกับ Worker และไม่มี `/` ท้าย URL
- **ขึ้น Unauthorized:** รหัส `OWNER_TOKEN` ที่กรอกไม่ตรงกับ Cloudflare ให้ล้างข้อมูลเว็บไซต์/Local Storage ของโดเมน GitHub Pages แล้วกดสร้าง QR ใหม่เพื่อกรอกอีกครั้ง
- **ขึ้น CORS หรือเชื่อม Worker ไม่ได้:** ตรวจ `ALLOWED_ORIGINS` ให้ตรงกับ origin เช่น `https://somchai.github.io` (ไม่มี path Repository และไม่มี slash ท้าย) จากนั้น Deploy Worker อีกครั้ง
- **Worker แจ้ง Storage read/write failed (502):** ตรวจ Bin ID, `JSONBIN_ACCESS_KEY`, สิทธิ์ Read/Update และตรวจว่า Bin ยังเป็น Private
- **เพื่อนเห็นข้อความไม่พบข้อมูลโชว์:** สร้าง QR ใหม่จากหน้าเจ้าของหลังแก้การเชื่อมต่อแล้ว
- **อย่าแก้ด้วยการใส่ key ลงในไฟล์เว็บ หรือเปลี่ยน Bin เป็น Public** เพราะข้อมูลหรือสิทธิ์อาจเปิดให้คนอื่น

## ความเป็นส่วนตัวและขอบเขต

- Bin ควรเป็น Private และ Access Key ควรมีเฉพาะสิทธิ์ Read/Update
- ผู้ที่มี QR สามารถเห็นเพลงใน Playlist ของโชว์นั้น ข้อมูลดังกล่าวจึงถือว่าแชร์ให้ผู้ชมแล้ว
- รหัส `OWNER_TOKEN` ใช้สำหรับอัปเดตโชว์ เก็บไว้ใน Cloudflare Secret และกรอกเฉพาะเบราว์เซอร์เจ้าของ
- คลังเพลงทั้งหมด การตั้งค่า และข้อมูลส่วนตัวเดิมยังอยู่ในเบราว์เซอร์เจ้าของ ไม่ได้อัปโหลดทั้งคลังไป JSONBin
- GitHub Pages เป็นเว็บไซต์สาธารณะ อย่าเก็บรหัสหรือข้อมูลส่วนตัวใน Repository

## แหล่งอ้างอิงทางการ

- [JSONBin: สร้าง Bin](https://jsonbin.io/api-reference/bins/create)
- [JSONBin: Access Keys](https://jsonbin.io/api-reference/access-keys/create)
- [JSONBin: อ่าน Bin](https://jsonbin.io/api-reference/bins/read)
- [JSONBin: อัปเดต Bin](https://jsonbin.io/api-reference/bins/update)
- [GitHub: ตั้งค่าแหล่งเผยแพร่ Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Cloudflare: สร้าง Worker](https://developers.cloudflare.com/workers/get-started/dashboard/)
- [Cloudflare: Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

คู่มือนี้เตรียมไฟล์และขั้นตอนไว้ให้แล้ว แต่การเชื่อมบัญชีจริงจะยืนยันได้หลังจากคุณตั้งค่าบัญชีของตัวเองและทดสอบ QR จากอุปกรณ์อีกเครื่อง
