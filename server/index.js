import e from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = e();
app.use(cors());
app.use(e.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});