import logo from '@/assets/images/logo.png'

export default function Logo() {
  return (
    <div className='h-auto w-20'>
      <img src={logo} alt="Lendo logo" className="h-full w-full object-contain" />
    </div>
  )
}
