# Full Stack Project Setup (Vue.js + Node.js + MongoDB)

📁 Folder Structure

frontend/ → Frontend Vue.js (uses npm/yarn)
backend/ → Backend Node.js + Express
database/ → Exported MongoDB collections (.json files)

1. Clone or Extract the Project

Unzip the folder. You should see `frontend/`, `backend/`, and `database/`.

2. Install Dependencies

🔧 Frontend (Vue.js)

cd frontend
npm install
🔧 Backend (Node.js + Express)
cd ../backend
npm install

3. Import MongoDB Data
You need to have MongoDB installed locally.
📂 Import the collections:
Run these in the terminal (adjust paths if needed):
mongoimport --db e-commerce --collection users --file ./mongo-data/users.json --jsonArray
mongoimport --db e-commerce --collection products --file ./mongo-data/products.json --jsonArray
mongoimport --db e-commerce --collection orders --file ./mongo-data/orders.json –jsonArray
mongoimport --db e-commerce --collection categories --file ./mongo-data/orders.json --jsonArray

📝 If you’re using MongoDB Compass, you can import each .json file through the GUI too.

4. Configure Environment (Optional)
In backend/, create a .env file (if needed):
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your_jwt_secret

 5. Run the Project
▶️ Start Backend
cd server
npm start
▶️ Start Frontend
cd client
npm run serve

6. Open in Browser
Frontend: http://localhost:8080
Backend:  http://localhost:5000/api


