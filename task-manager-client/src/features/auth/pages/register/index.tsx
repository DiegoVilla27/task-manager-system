import React from 'react';
import { User as UserIcon, Mail, Lock, UserCheck } from 'lucide-react';
import { Button, Input, Link } from '@shared/components/ui';
import useRegisterPage from './hooks';

export const RegisterPage: React.FC = () => {
  const { register, submit, errors } = useRegisterPage();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crear una cuenta</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Completa tus datos para comenzar a gestionar tus tareas
        </p>
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Juan"
            leftIcon={<UserIcon className="w-5 h-5" />}
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Apellido"
            type="text"
            placeholder="Pérez"
            leftIcon={<UserIcon className="w-5 h-5" />}
            {...register('lastname')}
            error={errors.lastname?.message}
          />
        </div>

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          leftIcon={<Mail className="w-5 h-5" />}
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-5 h-5" />}
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-5 h-5" />}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="mt-2"
          leftIcon={<UserCheck className="w-5 h-5" />}
        >
          Registrarse
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/auth/login" variant="purple">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
