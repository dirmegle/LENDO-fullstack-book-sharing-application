import { getNavLinks } from '@/router/pagesConfig'
import NavLink from './navLink'

export default function Navigation() {
    const navLinks = getNavLinks().map(
        ({path, pageIconUrl, linkText}) => (
            <NavLink key={path} isExpanded={true} pageIconUrl={pageIconUrl} link={path} pageName={linkText}/>
        )
    )
  return (
    <div className='w-[200px] p-2 bg-[#F3EBE5] rounded-md flex items-center sticky top-4 bottom-4 h-screen'>
      <nav>{navLinks}</nav>
    </div>
  )
}

