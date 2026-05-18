import { useEffect, useState } from 'react';

export default function OrderList({ status, onOpenReview }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // เปลี่ยน userId เป็นไอดีจำลองไปก่อน หรือดึงจาก Auth state ของคุณ
        const response = await fetch(`http://localhost:3001/api/orders?status=${status}&userId=123`);
        const data = await response.json();
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (loading) return <p style={{ padding: '20px', textAlign: 'center' }}>กำลังโหลดข้อมูล...</p>;
  if (orders.length === 0) return <p style={{ padding: '20px', textAlign: 'center', color: '#888' }}>ไม่มีรายการในหมวดหมู่นี้</p>;

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card" style={{ borderBottom: '1px solid #eee', padding: '16px' }}>
          <h4>ออเดอร์ #{order.id}</h4>
          <p>สินค้า: {order.item_name}</p>
          <p>ราคา/ข้อตกลง: {order.price}</p>
          
          {status === 'to-rate' && (
            <button 
              onClick={() => onOpenReview(order)}
              style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#ff4d4f', color: 'white', borderRadius: '8px', border: 'none' }}
            >
              ให้คะแนน
            </button>
          )}
        </div>
      ))}
    </div>
  );
}