import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
    email: string;
    senha: string;
}

export default function Login() {
    const { register, handleSubmit } = useForm<LoginForm>();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
    try {
        const res = await api.post('/api/auth/login', data);
        // Passar token E permissoesModulos para a função login
        login(res.data.token, res.data.permissoesModulos); // <-- CORRIGIDO
        navigate('/dashboard');
    } catch (err) {
        alert('Credenciais inválidas');
    }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl mb-4">Login</h2>
            <input {...register('email')} placeholder="Email" className="input mb-2 w-full border p-2" />
            <input {...register('senha')} type="password" placeholder="Senha" className="input mb-4 w-full border p-2" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Entrar</button>
        </form>
        </div>
    );
}
