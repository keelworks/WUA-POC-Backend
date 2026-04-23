import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
    console.log(`Swagger ready on http://localhost:${PORT}/docs`)
})
