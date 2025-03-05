import AbstractOne from '@/assets/icons/abstractOne.svg?react'
import style from './Loader.module.css'

export default function Loader() {
  return (
    <div className='w-20 h-20 m-auto'>
      <AbstractOne className={`${style.loader} w-full h-full`}/>
    </div>
  )
}
