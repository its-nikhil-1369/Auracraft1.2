import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        await dbConnect();

        // First, check if the order exists at all
        const orderExists = await Order.findById(id);

        if (!orderExists) {
            console.log(`❌ Order ${id} does not exist in database`);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if the order belongs to this user
        if (orderExists.user.toString() !== user.id) {
            console.log(`❌ Order ${id} belongs to user ${orderExists.user}, but current user is ${user.id}`);
            return NextResponse.json({ error: 'You do not have permission to view this order' }, { status: 403 });
        }

        // Fetch the order with populated data
        const order = await Order.findById(id).populate('items.product');

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Order fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
