import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { useSession, signOut } from 'next-auth/react'

type Props = {
    handleShowModal: () => void;
};

export const Header = ({ handleShowModal }: Props) => {
    const { data: session, status } = useSession()
    return (
        <header className='h-20 w-full border-b-2 border-slate-200 px-4'>
            <div className='lg:max-w-screen-lg mx-auto flex items-center justify-between h-full'>
                <div className='pt-8 pl-4 pb-7 flex items-center gap-x-3'>
                    <Image
                        src='/assets/PNG/Square/snake.png'
                        alt='Parrot Logo'
                        width={40}
                        height={40}
                    />
                    <h1 className='text-2xl font-extrabold text-green-600 tracking-wide'>
                        {' '}
                        English Card Battle
                    </h1>
                </div>

                {
                    status === 'loading' ? (
                        <p>読み込み中...</p>
                    ) : session? (
                        <>
                            <p>こんにちは、{session.user?.name}さん</p>
                            <Button size='lg' variant='ghost' onClick={() => signOut()}>
                                サインアウト
                            </Button>
                        </>
                ): (
                    <Button size='lg' variant='ghost' onClick={handleShowModal}>
                        Login
                    </Button>
                )}
            </div>
        </header>
    );
};
