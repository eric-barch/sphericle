import { ReactElement } from 'react';
import NavBarIconTip from '@/components/NavBarIconTip';

interface NavBarIconProps {
  icon: ReactElement;
  text?: string;
}


export default function NavBarIcon({ icon, text = 'Just a tip!' }: NavBarIconProps) {
  return (
    <div className="navbar-icon">
      {icon}
      {text && <NavBarIconTip text={text} />}
    </div>
  );
}