import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'DanoNews | Credible News Without Borders',description:'Follow Ghana, politics, sports, entertainment, business and world news. Independent publishing and headlines from established news sources.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
