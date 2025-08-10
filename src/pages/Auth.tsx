import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Building, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';
import type { UserRole } from '../types';
import { REGISTER_ROLES } from '../types';



const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  companyName: z.string().min(2, 'Nombre de empresa requerido'),
  nit: z.string().min(7, 'NIT inválido'),
  location: z.string().min(2, 'Debes seleccionar una ciudad'),
  role: z.enum(REGISTER_ROLES), // ✅ ahora sí es un valor en runtime
});


type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'generador1@example.com',
      password: '123456',
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const user = await authAPI.login(data.email, data.password);
      login(user);
      navigate(user.role === 'GEN' ? '/publish' : '/feed');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const user = await authAPI.register(data);
      login(user);
      navigate(user.role === 'GEN' ? '/publish' : '/feed');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Accede a tu cuenta T2C' : 'Únete a la economía circular'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="tu@empresa.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Cuenta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative">
                    <input
                      {...registerForm.register('role')}
                      type="radio"
                      value="GEN"
                      className="sr-only"
                    />
                    <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-300 transition-colors peer-checked:border-green-500 peer-checked:bg-green-50">
                      <Building className="w-6 h-6 text-gray-600 mb-2" />
                      <div className="font-medium text-gray-900">Generador</div>
                      <div className="text-sm text-gray-600">Vendo residuos</div>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      {...registerForm.register('role')}
                      type="radio"
                      value="REC"
                      className="sr-only"
                    />
                    <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50">
                      <UserIcon className="w-6 h-6 text-gray-600 mb-2" />
                      <div className="font-medium text-gray-900">Recicladora</div>
                      <div className="text-sm text-gray-600">Compro residuos</div>
                    </div>
                  </label>
                </div>
                {registerForm.formState.errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.role.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    {...registerForm.register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="tu@empresa.com"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      {...registerForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Empresa
                </label>
                <input
                  {...registerForm.register('companyName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Mi Empresa S.R.L."
                />
                {registerForm.formState.errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIT
                  </label>
                  <input
                    {...registerForm.register('nit')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                  {registerForm.formState.errors.nit && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.nit.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <select
                    {...registerForm.register('location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="La Paz">La Paz</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="Cochabamba">Cochabamba</option>
                    <option value="Sucre">Sucre</option>
                    <option value="Oruro">Oruro</option>
                    <option value="Potosí">Potosí</option>
                  </select>
                  {registerForm.formState.errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};