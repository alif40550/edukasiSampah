# Panduan Lengkap Deployment ke Production: Edukasi Pengelolaan Sampah x Kampoeng Radja Jambi

Dokumen ini memuat audit keamanan, checklist sebelum rilis, serta langkah demi langkah menaikkan aplikasi web **Next.js** dan database **MySQL** ke server production.

---

## 1. Audit Keamanan & Kesiapan Kode (Status: SIAP & AMAN)

Kode telah diaudit dan dinyatakan siap untuk production dengan rincian:
- **Clean Production Build**: Telah lolos kompilasi `next build` tanpa error (seluruh rute App Router dan Dynamic API `export const dynamic = 'force-dynamic'` teroptimasi sempurna).
- **Proteksi File Rahasia (`.gitignore`)**: Berkas `.env*.local` dipastikan tidak akan ter-commit ke Git repo. Template kredensial publik disediakan di `.env.example`.
- **Database Fallback & Error Handling**: Jika koneksi MySQL sementara terputus saat deploy, aplikasi memiliki penanganan *in-memory fallback* otomatis sehingga pengunjung tidak akan pernah melihat layar *Internal Server Error (500)*.
- **Cookie Admin Aman**: Sesi login admin menggunakan flag `httpOnly: true`, `sameSite: 'lax'`, dan berlaku 24 jam sehingga terlindung dari serangan *Cross-Site Scripting (XSS)*.
- **Constraint Database**: Menggunakan `UNIQUE KEY (email, visit_date)` untuk mencegah duplikasi data presensi harian pada level database engine.

---

## 2. Checklist Sebelum Naik ke Production

Sebelum aplikasi live ke publik, pastikan Anda telah menyesuaikan nilai pada environment variables di server:

1. **Ubah Password Admin**:
   Jangan gunakan password default `admin`. Buat password yang kuat di `.env.local`:
   ```env
   ADMIN_USERNAME=admin_kampoengradja
   ADMIN_PASSWORD=KombinasiHurufAngkaSimbolKuat2026!
   ADMIN_SECRET_TOKEN=buat_random_hash_panjang_minimal_32_karakter
   ```
2. **Koneksi MySQL Production**:
   Pastikan user MySQL memiliki izin `CREATE DATABASE`, `CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE` pada database `edukasi_sampah`.
3. **(Opsional) Google OAuth Client ID**:
   Jika ingin menggunakan login Google Identity resmi dari domain production Anda, daftarkan domain website Anda di Google Cloud Console (OAuth Consent Screen -> Authorized JavaScript Origins).

---

## 3. Pilihan Cara Deployment

Pilih metode yang paling sesuai dengan infrastruktur yang Anda miliki:

---

### OPSI A: VPS / Cloud Server Mandiri (Ubuntu / Debian / AlmaLinux) — *Paling Direkomendasikan untuk MySQL Lokal*

Metode ini menggunakan **Node.js**, **PM2** (Process Manager agar aplikasi menyala terus-menerus dan restart otomatis saat server reboot), dan **Nginx** sebagai reverse proxy + SSL HTTPS.

#### Langkah 1: Persiapan Server
```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20 atau v24 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git mariadb-server

# Install PM2 secara global
sudo npm install -g pm2
```

#### Langkah 2: Setup Database MySQL di Server
```bash
sudo mysql -u root
```
Di dalam prompt MySQL / MariaDB, jalankan:
```sql
CREATE DATABASE IF NOT EXISTS edukasi_sampah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sampah_user'@'localhost' IDENTIFIED BY 'PasswordDbKuat123!';
GRANT ALL PRIVILEGES ON edukasi_sampah.* TO 'sampah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Langkah 3: Deploy Kode Aplikasi
```bash
# Clone repository proyek Anda ke server
cd /var/www
git clone <URL_REPOSITORY_ANDA> edukasiSampah
cd edukasiSampah

# Buat file konfigurasi production
cp .env.example .env.local
nano .env.local
```
Isi `.env.local` dengan kredensial server:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=sampah_user
MYSQL_PASSWORD=PasswordDbKuat123!
MYSQL_DATABASE=edukasi_sampah

ADMIN_USERNAME=admin
ADMIN_PASSWORD=PasswordAdminAman2026!
ADMIN_SECRET_TOKEN=ganti_dengan_token_acak_panjang_sekali_32_karakter
```

#### Langkah 4: Install Dependensi & Build
```bash
# Install packages
npm install --production=false

# Jalankan kompilasi produksi Next.js
npm run build

# Jalankan dengan PM2
pm2 start npm --name "edukasi-sampah" -- start -- -p 3000

# Konfigurasikan PM2 agar otomatis hidup kembali saat server reboot
pm2 startup
pm2 save
```

#### Langkah 5: Konfigurasi Nginx & HTTPS (Domain)
Buat konfigurasi virtual host Nginx:
```bash
sudo nano /etc/nginx/sites-available/edukasisampah.com
```
Salin konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name edukasisampah.com www.edukasisampah.com; # Ganti dengan domain Anda

    # Optimasi streaming media video & pdf
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Aktifkan konfigurasi dan pasang SSL gratis (Let's Encrypt):
```bash
sudo ln -s /etc/nginx/sites-available/edukasisampah.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL Gratis
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d edukasisampah.com -d www.edukasisampah.com
```

---

### OPSI B: Cloud Hosting PaaS (Vercel + Managed Database)

Jika Anda ingin kemudahan tanpa harus mengelola Linux server:

1. **Database MySQL di Cloud**:
   - Gunakan layanan cloud database gratis/murah seperti:
     - **Railway.app** (memiliki template MySQL 1-klik)
     - **Aiven.io** (paket free tier MySQL)
     - **PlanetScale** atau **TiDB Cloud**
   - Dapatkan connection string: Host, Port, User, Password, Database.

2. **Deploy Aplikasi ke Vercel**:
   - Push repository proyek Anda ke **GitHub / GitLab**.
   - Buka [vercel.com](https://vercel.com) -> Login -> **Add New Project**.
   - Pilih repository `edukasiSampah`.
   - Pada bagian **Environment Variables**, tambahkan:
     - `MYSQL_HOST`
     - `MYSQL_PORT`
     - `MYSQL_USER`
     - `MYSQL_PASSWORD`
     - `MYSQL_DATABASE`
     - `ADMIN_USERNAME`
     - `ADMIN_PASSWORD`
     - `ADMIN_SECRET_TOKEN`
   - Klik **Deploy**. Website Anda akan aktif dalam ~1 menit dengan HTTPS otomatis!

---

## 4. Cara Update / Redeploy di Masa Depan
Jika Anda melakukan perubahan kode di kemudian hari pada VPS:
```bash
cd /var/www/edukasiSampah
git pull origin main
npm install
npm run build
pm2 restart edukasi-sampah
```

