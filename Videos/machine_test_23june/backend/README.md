# 🚀 Ajayify - Node.js REST API Boilerplate

A scalable and production-ready Node.js REST API boilerplate using **Express, MySQL, and Sequelize ORM**.

---

## 📦 Features

* 🔐 Authentication using JWT
* 🔑 Password hashing with bcrypt
* 📦 Sequelize ORM (MySQL)
* 📁 MVC Folder Structure
* 🛡️ Validation using validatorjs
* 📤 File upload with multer
* 🌐 CORS enabled
* ⚙️ Environment-based config (.env)

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MySQL
* Sequelize ORM

---

## 📥 Installation

```bash
npm install ajayify
```

---

## 🚀 Usage

1. Clone or install package
2. Setup `.env` file

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
JWT_SECRET=your_secret
```

3. Run project

```bash
npm run dev
```

---

## 📂 Project Structure

```
├── controllers/
├── models/
├── routes/
├── middlewares/
├── validation/
├── config/
├── utilities/
├── app.js
```

---

## 🔐 Authentication

* JWT based authentication
* Protected routes support

---

## 📡 API Features

* CRUD APIs
* User authentication
* File uploads
* Validation middleware

---

## 📌 Dependencies

* express
* sequelize
* mysql2
* jsonwebtoken
* bcrypt
* multer
* dotenv
* cors
* validatorjs

---

## 👨‍💻 Author

Ajay Achhane

---

## 📄 License

ISC
