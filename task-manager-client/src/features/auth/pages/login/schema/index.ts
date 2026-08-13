import z from "zod";

const LoginSchema = z.object({
  email: z.string().min(1, "El correo electrónico es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export default LoginSchema;