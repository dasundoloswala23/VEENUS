import { orders } from '@/data';
import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return orders.map((order) => ({
    id: order.id,
  }));
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailClient params={params} />;
}
