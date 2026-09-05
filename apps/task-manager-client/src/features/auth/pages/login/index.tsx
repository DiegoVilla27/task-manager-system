import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Link } from '@shared/components/ui';
import useLoginPage from './hooks';

export const LoginPage: React.FC = () => {
  const { register, submit, errors } = useLoginPage();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ingresa tus credenciales para acceder a tus tareas
        </p>
      </div>

      <form className="space-y-5" onSubmit={submit}>
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          leftIcon={<Mail className="w-5 h-5" />}
          {...register('email')}
          error={errors.email?.message}
        />

        <div>
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-center justify-start mb-6 w-full">
          <Link to="#" variant="purple" className="text-xs">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Ingresar
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿No tienes una cuenta?{' '}
        <Link to="/auth/register" variant="purple">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
