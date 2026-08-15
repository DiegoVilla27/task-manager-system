import type { AuthLoginRequest } from '@features/auth/interfaces/request';
import { loginSvc } from '@features/auth/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import LoginSchema from '../schema';
import { useNavigate } from 'react-router-dom';

const useLoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });

  const onSubmit = async (payload: AuthLoginRequest) => {
    await loginSvc(payload);
    navigate('/');
  };

  return {
    register,
    errors,
    submit: handleSubmit(onSubmit),
  };
};

export default useLoginPage;
