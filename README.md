
# 🚖 Hamartaxi - Full Taxi System Setup

![Ubuntu](https://img.shields.io/badge/Ubuntu-22.04-blue.svg)
![NestJS](https://img.shields.io/badge/Backend-NestJS-red.svg)
![React](https://img.shields.io/badge/Frontend-React-blue.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

---

## 📋 Project Structure

| Part | Description |
|:-----|:------------|
| `hamartaxi-backend/` | Backend server built with NestJS |
| `hamartaxi-admin/` | Admin dashboard built with React + CoreUI |
| MongoDB | Database to store users, rides, history, etc. |
| PM2 | Process manager for backend |
| Nginx | Web server + SSL proxy |

---

## 🚀 Setup Instructions

### 1. Update Ubuntu Server
```bash
sudo apt update && sudo apt upgrade -y
```
> 🛠️ Updates the package list and upgrades all installed software to latest versions.

---

### 2. Install Node.js, npm, and PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```
> 📦 Node.js is needed to run backend and frontend. PM2 keeps backend running forever.

---

### 3. Install MongoDB Database
```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```
> 🗄️ MongoDB stores all passenger, driver, admin, and trip data.

---

### 4. Setup MongoDB Admin User
```bash
mongosh
use hamartaxi
db.createCollection('adminusers')
db.adminusers.insertOne({
  email: 'admin@hamartaxi.com',
  password: '<bcrypt-hashed-password>',
  role: 'SuperAdmin'
})
```
> 🛡️ This creates the database and a SuperAdmin login for the Admin Panel.

---

### 5. Deploy Backend API (NestJS)
```bash
cd hamartaxi-backend
npm install
npm run build
pm2 start dist/main.js --name hamartaxi-backend
pm2 save
```
> 🔥 Starts the backend API server with authentication, booking logic, and WebSocket (Socket.IO).

---

### 6. Deploy Admin Panel (React)
```bash
cd hamartaxi-admin
npm install
npm run build

sudo mkdir -p /var/www/hamartaxi-admin
sudo rm -rf /var/www/hamartaxi-admin/*
sudo cp -r dist/* /var/www/hamartaxi-admin
```
> 🎨 Admin panel where you manage drivers, passengers, trips, payouts.

---

### 7. Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/hamartaxi
```
Example:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/hamartaxi-admin;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/hamartaxi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
> 🌐 Nginx forwards requests to backend and serves frontend.

---

### 8. Enable SSL with Let's Encrypt (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
> 🔒 Free HTTPS secured certificates using Certbot.

---

### 9. Connect Admin Login
```javascript
// src/views/pages/login/Login.js
const response = await axios.post('https://yourdomain.com/api/admin/login', {
  email,
  password
})
localStorage.setItem('admin_token', response.data.token)
navigate('/dashboard')
```
> 🔐 Connect Admin Panel login securely with backend API.

---

## 📷 Screenshots (Placeholders)

| Login Page | Dashboard |
|:-----------|:----------|
| ![Login](https://via.placeholder.com/400x200?text=Login+Page) | ![Dashboard](https://via.placeholder.com/400x200?text=Admin+Dashboard) |

---

## 📜 Auto Scripts Provided

| Script | Description |
|:-------|:------------|
| `hamartaxi_server_setup.sh` | Install Node.js, MongoDB, Nginx, Certbot |
| `hamartaxi_backend_deploy.sh` | Build & deploy backend |
| `hamartaxi_frontend_deploy.sh` | Build & deploy frontend |

---

## 📈 System Summary

| Service | Port |
|:--------|:-----|
| Backend API (NestJS) | 3000 |
| Admin Panel (React) | 80/443 (Nginx) |
| MongoDB | 27017 |

---

## 👨‍💻 Author

- **Built by:** YourCompany (or you)
- **Email:** admin@yourdomain.com

---

> Made with ❤️ for the new generation of taxi platforms.
