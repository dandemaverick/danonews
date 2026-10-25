import type {ArticleImage} from '../lib/articles';
export default function ArticleGallery({images=[]}:{images?:ArticleImage[]}) {
 return images.length?<section aria-label="Article photos" className="article-gallery">{images.map((image,i)=><figure key={image.url+'-'+i}><img src={image.url} alt={image.alt} loading="lazy" style={{width:'100%',height:'auto',display:'block'}}/>{(image.caption||image.credit)&&<figcaption>{image.caption}{image.credit&&<span> {image.caption?'— ':''}Photo: {image.credit}</span>}</figcaption>}</figure>)}</section>:null;
}
