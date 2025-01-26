import { getNavLinks } from '@/router/pagesConfig'
import NavLink from './navLink'
import styles from './navigation.module.css'
import classNames from 'classnames'
import ArrowRight from '@/assets/icons/arrowRight.svg?react'
import ArrowLeft from '@/assets/icons/arrowLeft.svg?react'
import { useEffect, useState } from 'react'

export default function Navigation() {

  const [isExpanded, setIsExpanded] = useState(() => {
    const savedExpansionSetting = localStorage.getItem('isExpanded');
    return savedExpansionSetting !== null ? JSON.parse(savedExpansionSetting) : true;
  });

  useEffect(() => {
    localStorage.setItem('isExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
    const navLinks = getNavLinks().map(
        ({path, pageIconUrl, linkText}) => (
            <NavLink key={path} isExpanded={isExpanded} pageIconUrl={pageIconUrl} link={path} pageName={linkText}/>
        )
    )

    const navClasses = classNames(styles.nav, 'hidden w-max-content p-4 bg-[#F3EBE5] 2xl:rounded-md rounded-r-md  md:flex flex-col items-center justify-center sticky top-4', isExpanded ? 'w-44' : 'w-20')
  return (
    <aside className={navClasses}>
      <button onClick={handleClick} className='absolute top-0 bg-accent-green w-full rounded-t-md flex justify-center p-2 hover:bg-muted-green transition-all duration-300 ease-in-out'>{isExpanded ? <ArrowLeft /> : <ArrowRight />}</button>
      <nav>{navLinks}</nav>
    </aside>
  )
}
