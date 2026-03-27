import { products } from '@/data';
import EditProductClient from './EditProductClient';

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function EditProductPage({ params }: { params: { slug: string } }) {
  return <EditProductClient params={params} />;
}
