import express from "express";
import eventoRoutes from "./routes/eventos";
import palestranteRoutes from "./routes/eventos";
 
const app = express();
 
app.use(express.json());
 
app.use("/eventos", eventoRoutes);
app.use("/palestrantes", palestranteRoutes);
 
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});