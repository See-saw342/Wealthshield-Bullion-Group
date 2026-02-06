require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the parent directory (frontend)
const frontendRoot = path.join(__dirname, "../");
app.use(express.static(frontendRoot));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Clean URL support (e.g., /login -> /login.html)
app.get(/.*/, (req, res, next) => {
	if (req.path.startsWith("/api/")) return next();

	const cleanPath = req.path === "/" ? "/index" : req.path;
	const htmlPath = path.join(frontendRoot, `${cleanPath}.html`);

	if (fs.existsSync(htmlPath)) {
		return res.sendFile(htmlPath);
	}

	return next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
