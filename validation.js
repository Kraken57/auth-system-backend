const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8)
  .max(100)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/[0-9]/)
  .regex(/[!@#$%^&*(),.?":{}|<>]/);


const requiredBody = z.object({
    email : z.string().min(8).max(100).email(),
    password: passwordSchema,
    name: z.string().min(3).max(100),
})

module.exports = {
    requiredBody
}