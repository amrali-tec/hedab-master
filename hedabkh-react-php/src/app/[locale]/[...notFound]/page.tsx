import { useParams } from 'react-router-dom';
import { notFound } from 'next/navigation';


export default function CatchAllNotFound(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  notFound();
}
