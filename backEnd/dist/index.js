"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const sigupRoute_1 = __importDefault(require("./routes/sigupRoute"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const uploadRouter_1 = __importDefault(require("./routes/uploadRouter"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const verifyJWTToken_1 = require("./middileware/verifyJWTToken");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: true, // This can be restricted to specific domains in production
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
}));
// Serve static files from the "public" directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use('/login', loginRoute_1.default);
app.use('/signup', sigupRoute_1.default);
app.use(verifyJWTToken_1.verifyJWTToken);
app.use('/profile', profileRoutes_1.default);
app.use('/upload', uploadRouter_1.default);
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Something went wrong!');
});
(0, db_1.default)()
    .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 3001;
    const server = http_1.default.createServer(app);
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
