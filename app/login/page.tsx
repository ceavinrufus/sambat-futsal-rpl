import React from 'react';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import UnauthRoute from '@/components/UnauthRoute';

const Login = () => {
    return (
        <>
            <UnauthRoute />
            <Navbar transparent />
            <div className=''>
                <div className="bg-primary rounded-l-2xl h-screen right-0 absolute top-0 w-1/2 -z-10"></div>
                <div className="h-screen w-screen flex justify-center">
                    <div className="h-full w-full max-w-[1600px] flex">
                        <div className="w-1/3 flex flex-col justify-center items-center gap-6 p-10">
                            <div className="flex flex-col justify-center items-center gap-4">
                                <h2 className='text-4xl font-bold'>New Here?</h2>
                                <h3 className='text-2xl text-center'>Buat akun sekarang dan pesan lapangan anda dengan mudah!</h3>
                            </div>
                            <Button variant='secondary'>
                                <a href='/register' className='font-bold'>
                                    Register
                                </a>
                            </Button>
                        </div>
                        <div className="w-2/3 flex justify-center items-center bg-primary flex-col gap-8 rounded-l-2xl">
                            <h2 className='text-white text-4xl font-bold'>Login</h2>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;