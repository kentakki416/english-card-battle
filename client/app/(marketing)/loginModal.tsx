import Image from 'next/image';
import { signIn } from 'next-auth/react';

type Props = {
    handleShowModal: () => void;
};

const LoginModal = ({ handleShowModal }: Props) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='relative bg-white rounded-xl shadow-lg px-16 border-gray-500'>
                <button
                    type='button'
                    className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close'
                    onClick={handleShowModal}
                >
                    <svg
                        aria-hidden='true'
                        className='w-5 h-5'
                        fill='#c6c7c7'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            fill-rule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                        ></path>
                    </svg>
                    <span className='sr-only'>Close popup</span>
                </button>

                <div className='p-5'>
                    <h3 className='text-2xl mb-0.5 font-medium'></h3>
                    <p className='mb-4 text-sm font-normal text-gray-800'></p>

                    <div className='text-center'>
                        <p className='mb-3 text-2xl font-semibold leading-5 text-slate-900'>
                            Login to your account
                        </p>
                        <p className='mt-2 text-sm leading-4 text-slate-600'>
                            You must be logged in to perform this action.
                        </p>
                    </div>

                    <div className='mt-7 flex flex-col gap-2'>
                        <button className='inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-400'>
                            <Image
                                width={100}
                                height={100}
                                src='https://www.svgrepo.com/show/512317/github-142.svg'
                                alt='GitHub'
                                className='h-[18px] w-[18px] '
                            />
                            Continue with GitHub
                        </button>

                        <button 
                            onClick={() => signIn('google')}
                            className='inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-400'>
                            <Image
                                width={100}
                                height={100}
                                src='https://www.svgrepo.com/show/475656/google-color.svg'
                                alt='Google'
                                className='h-[18px] w-[18px]'
                            />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
