import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { isAdmin } from '@/lib/auth';

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        console.log('🗑️ Delete request for order:', id);

        const adminCheck = await isAdmin();
        if (!adminCheck) {
            console.log('❌ Unauthorized: User is not admin');
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        console.log('✓ Admin check passed');
        await dbConnect();
        console.log('✓ Database connected');

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            console.log('❌ Order not found:', id);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('✓ Order deleted successfully:', id);
        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully',
            orderId: id
        });
    } catch (error: any) {
        console.error('❌ Order deletion error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
    }
}
