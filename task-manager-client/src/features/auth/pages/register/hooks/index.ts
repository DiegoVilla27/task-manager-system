import type { AuthRegisterRequest } from "@features/auth/interfaces/request";
import { registerSvc } from "@features/auth/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RegisterSchema from "../schema";

const useRegisterPage = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthRegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: 'all'
  })

  const onSubmit = async (payload: AuthRegisterRequest) => {
    await registerSvc(payload);
    navigate("/");
  }

  return {
    register,
    submit: handleSubmit(onSubmit),
    errors
  }
}

export default useRegisterPage