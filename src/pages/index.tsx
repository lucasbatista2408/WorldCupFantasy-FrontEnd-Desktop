import { HomeProps } from '../interfaces/home'
import appPhoneImg from '../assets/app-phone.png'
import logoImg from '../assets/app-logo.svg'
import appUsersAvatars from '../assets/app-users-avatares.png'
import appCheckIcon from '../assets/app-check-icon.svg'
import Image from 'next/image'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'
import { GetStaticProps } from 'next'

export default function Home(props: HomeProps) {

  const [pool, setPool] = useState('')

  async function createPool(e: FormEvent){
    e.preventDefault()

    const data = {
      title: pool,
      ownerId: null
    }

    try {
      
      const response:any = await api.post("pools/create", data)
      const {code} = response.data
      console.log(code)

      await navigator.clipboard.writeText(code)

      alert('Your Fantasy Games has been created sucessfully')
      // window.location.reload()

    } catch (error) {
      
      console.error(error)
      alert('Failed trying to create fantasy game')
    
    }
    

  }


  return (
   <div className='flex max-w-[1124px] h-screen mx-auto grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt='logo-image' quality={100} />
        
        <h1 className='text-white mt-14 text-5xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        
        <div className='flex mt-10 items-center gap-2 text-xl'>
          <Image src={appUsersAvatars} alt='users-avatars' quality={100}/>
          <strong className='text-igniteGray-500'>
            <span className='text-igniteGreen-500'>+{props.usersCount} </span>pessoas já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={createPool}>
          <input className='flex-1 px-2 py-4 rounded text-gray-100 bg-gray-800 border border-gray-600 text-sm' type="text" placeholder='Qual o nome do seu bolão?' onChange={e => setPool(e.target.value)} value={pool}/>
          <button className='bg-igniteYellow-500 text-gray-900 font-bold text-sm uppercase hover:bg-igniteYellow-700 px-2 py-4' type='submit'>Criar meu bolão</button>
        </form>

        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100'>
          <div className='flex items-center gap-6 '>
            <Image src={appCheckIcon} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>
          <div className='border border-gray-600'></div>
          <div className='flex items-center gap-6'>
            <Image src={appCheckIcon} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>

      </main>
      <Image 
      src={appPhoneImg} 
      alt='app-phone-logo'
      quality={100}/>
   </div>
  )
}

export const getStaticProps: GetStaticProps = async () =>{

  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count")
  ])

  return{
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: userCountResponse.data.count
    },
    revalidate: 20,
  }
}