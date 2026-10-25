import type { CSSProperties } from 'react';

type LogoProps={size:'sm'|'md'|'lg';variant:'full'|'mark';className?:string};
const dimensions={
  full:{sm:[96,49],md:[128,65],lg:[188,96]},
  mark:{sm:[36,39],md:[44,48],lg:[64,70]}
} as const;

export default function Logo({size,variant,className}:LogoProps){
  const [width,height]=dimensions[variant][size];
  const style:CSSProperties={width,height,objectFit:'contain'};
  return <img className={className} src={variant==='full'?'/logo.png':'/logo-mark.png'} alt="KHOJ logo" width={width} height={height} style={style}/>;
}
