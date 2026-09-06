import { registerSvc } from '@features/auth/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import RegisterSchema from '../schema';
import type { AuthRegisterRequest } from '@task-manager-system/api-types';

export interface AuthRegisterPayload extends AuthRegisterRequest {
  confirmPassword: string;
}

const useRegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuthRegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'all',
  });

  const onSubmit = async (payload: AuthRegisterPayload) => {
    const cleanPayload: AuthRegisterRequest = {
      name: payload.name,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
    };
    await registerSvc(cleanPayload);
    navigate('/');
  };

  return {
    register,
    submit: handleSubmit(onSubmit),
    errors,
    setValue,
  };
};

export default useRegisterPage;
