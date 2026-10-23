import {siteUrl} from '../lib/seo';
export default function PageSEO({title,description,path,image,type='website'}:{title:string;description:string;path:string;image?:string;type?:'website'|'article'}) {
  const url=siteUrl+path;
  const imageUrl=image?new URL(image,siteUrl).href:undefined;
  return <><title>{title}</title><meta name="description" content={description}/><link rel="canonical" href={url}/>
    <meta name="robots" content="index, follow, max-image-preview:large"/>
    <meta property="og:site_name" content="DanoNews"/><meta property="og:type" content={type}/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:url" content={url}/>
    <meta name="twitter:card" content={imageUrl?'summary_large_image':'summary'}/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/>
    {imageUrl&&<><meta property="og:image" content={imageUrl}/><meta name="twitter:image" content={imageUrl}/></>}
  </>;
}
